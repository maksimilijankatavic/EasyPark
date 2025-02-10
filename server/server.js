const express = require("express");
const supabase = require("./supabaseClient.js");
const EventEmitter = require("events");
const cors = require("cors");

const app = express();
const port = 3000;
const eventEmitter = new EventEmitter();

app.use(express.json());
app.use(cors());

// Event listener for fetching parking data
eventEmitter.on("getParkingData", async (parkingId, res) => {
  try {
    const { data: parkingData, error: parkingError } = await supabase.rpc("dohvati_podatke_parkinga", {
      p_id_parkinga: parkingId,
    });

    if (parkingError) {
      console.error("Greška pri dohvaćanju podataka o parkingu:", parkingError.message);
      return res.status(500).json({ error: "Greška pri dohvaćanju podataka o parkingu." });
    }

    if (!parkingData || parkingData.length === 0) {
      return res.status(404).json({ error: "Parking nije pronađen." });
    }

    const { data: slobodnaMjestaData, error: slobodnaMjestaError } = await supabase.rpc("slobodna_mjesta", {
      parking_id: parkingId,
    });

    if (slobodnaMjestaError) {
      console.error("Greška pri dohvaćanju slobodnih mjesta:", slobodnaMjestaError.message);
      return res.status(500).json({ error: "Greška pri dohvaćanju slobodnih mjesta." });
    }

    const slobodnaMjesta = slobodnaMjestaData[0]?.slobodna_mjesta;

    if (slobodnaMjesta === undefined) {
      return res.status(500).json({ error: "Neispravan odgovor RPC funkcije za slobodna mjesta." });
    }

    const response = {
      ...parkingData[0],
      slobodna_mjesta: slobodnaMjesta,
    };

    res.json(response);
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to get parking data
app.get("/parking/podaci/:id", (req, res) => {
  const parkingId = parseInt(req.params.id, 10);

  if (isNaN(parkingId)) {
    return res.status(400).json({ error: "Neispravan parking ID." });
  }

  eventEmitter.emit("getParkingData", parkingId, res);
});

// Event listener for fetching free parking spots
eventEmitter.on("getFreeSpots", async (parkingId, res) => {
  try {
    const { data, error } = await supabase.rpc("slobodna_mjesta", {
      parking_id: parkingId,
    });

    if (error) {
      return res.status(500).json({ error: "Greška prilikom dohvaćanja podataka" });
    }

    const slobodnaMjesta = data[0]?.slobodna_mjesta;
    if (slobodnaMjesta === undefined) {
      return res.status(500).json({ error: "Neispravan odgovor RPC funkcije" });
    }
    res.json({ slobodna_mjesta: slobodnaMjesta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nepoznata greška" });
  }
});

// Route to get free parking spots
app.get("/slobodna-mjesta/:id", (req, res) => {
  const parkingId = parseInt(req.params.id, 10);

  if (isNaN(parkingId)) {
    return res.status(400).json({ error: "Neispravan parking ID." });
  }

  eventEmitter.emit("getFreeSpots", parkingId, res);
});

// Event listener for purchasing or updating a ticket
eventEmitter.on("purchaseTicket", async (voziloId, parkingId, vrijemeIsteka, res) => {
  try {
    const { data: vehicleExists, error: vehicleCheckError } = await supabase
      .from("Vozila")
      .select("id_registarska_ozn")
      .eq("id_registarska_ozn", voziloId)
      .single();

    if (vehicleCheckError && vehicleCheckError.code !== "PGRST116") {
      console.error("Error checking vehicle existence:", vehicleCheckError);
      return res.status(500).json({ error: "Error checking vehicle existence." });
    }

    if (!vehicleExists) {
      const { error: addVehicleError } = await supabase.rpc("dodaj_novo_vozilo", {
        p_id_registarska_ozn: voziloId,
        p_fk_korisnik: null,
      });

      if (addVehicleError) {
        console.error("Error adding vehicle:", addVehicleError);
        return res.status(500).json({ error: "Error adding vehicle." });
      }
    }

    const { error: ticketError } = await supabase.rpc("dodaj_ili_azuriraj_kupljena_karta", {
      p_fk_vozilo: voziloId,
      p_fk_parking: parkingId,
      p_vrijeme_isteka: vrijemeIsteka,
    });

    if (ticketError) {
      console.error("Error adding/updating ticket:", ticketError);
      return res.status(500).json({ error: "Error adding or updating the ticket." });
    }

    return res.json({ message: "Ticket successfully added or updated." });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error occurred." });
  }
});

// Route to purchase or update a ticket
app.post("/kupljena-karta", (req, res) => {
  const { voziloId, parkingId, vrijemeIsteka } = req.body;
  eventEmitter.emit("purchaseTicket", voziloId, parkingId, vrijemeIsteka, res);
});

// Event listener for deleting a ticket
eventEmitter.on("deleteTicket", async (voziloId, res) => {
  try {
    const { data: vehicleExists, error: vehicleCheckError } = await supabase
      .from("Kupljene_karte")
      .select("FK_vozilo")
      .eq("FK_vozilo", voziloId)
      .single();

    if (vehicleCheckError && vehicleCheckError.code !== "PGRST116") {
      console.error("Error checking vehicle existence:", vehicleCheckError);
      return res.status(500).json({ error: "Error checking vehicle existence." });
    }

    if (!vehicleExists) {
      return res.status(404).json({ message: "Ticket doesn't exist." });
    }

    const { error: deleteError } = await supabase.rpc("obrisi_kupljenu_kartu", {
      p_fk_vozilo: voziloId,
    });

    if (deleteError) {
      console.error("Error deleting ticket:", deleteError);
      return res.status(500).json({ error: "Error deleting the ticket." });
    }

    return res.json({ message: "Ticket successfully deleted." });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error occurred." });
  }
});

// Route to delete a ticket
app.delete("/kupljena-karta/:voziloId", (req, res) => {
  const { voziloId } = req.params;
  eventEmitter.emit("deleteTicket", voziloId, res);
});

// Event listener for adding a vehicle
eventEmitter.on("addVehicle", async (idRegistarskaOzn, fkKorisnik, res) => {
  try {
    const { error } = await supabase.rpc("dodaj_novo_vozilo", {
      p_id_registarska_ozn: idRegistarskaOzn,
      p_fk_korisnik: fkKorisnik,
    });

    if (error) {
      console.error("Greška pri dodavanju vozila:", error.message);
      return res.status(500).json({ error: "Greška pri dodavanju vozila." });
    }

    res.status(201).json({ message: "Vozilo uspješno dodano." });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to add a vehicle
app.post("/vozilo/dodaj", (req, res) => {
  const { idRegistarskaOzn, fkKorisnik } = req.body;
  eventEmitter.emit("addVehicle", idRegistarskaOzn, fkKorisnik, res);
});

// Event listener for fetching parking zone data
eventEmitter.on("getParkingZoneData", async (parkingId, res) => {
  try {
    const { data, error } = await supabase.rpc("dohvati_podatke_parkinga", {
      p_id_parkinga: parkingId,
    });

    if (error) {
      console.error("Greška pri dohvaćanju podataka o parkingu:", error.message);
      return res.status(500).json({ error: "Greška pri dohvaćanju podataka o parkingu." });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Parking nije pronađen." });
    }

    res.json(data);
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to get parking zone data
app.get("/parking/zona/:id", (req, res) => {
  const parkingId = parseInt(req.params.id);

  if (isNaN(parkingId)) {
    return res.status(400).json({ error: "Neispravan ID parkinga." });
  }

  eventEmitter.emit("getParkingZoneData", parkingId, res);
});

// Event listener for updating parking income
eventEmitter.on("updateParkingIncome", async (idParking, iznos, res) => {
  try {
    const { error } = await supabase.rpc("azuriraj_prihod", {
      p_id_parkinga: idParking,
      p_iznos: iznos,
    });

    if (error) {
      console.error("Greška pri pozivanju funkcije:", error);
      return res.status(500).json({ error: "Greška pri ažuriranju prihoda." });
    }

    res.status(200).json({ message: "Prihod uspješno ažuriran." });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to update parking income
app.put("/parking/prihod", (req, res) => {
  const { idParking, iznos } = req.body;

  if (!idParking || !iznos) {
    return res.status(400).json({ error: "Nedostaju potrebni parametri: idParking i iznos." });
  }

  eventEmitter.emit("updateParkingIncome", idParking, iznos, res);
});

// Event listener for adding monthly income
eventEmitter.on("addMonthlyIncome", async (res) => {
  try {
    const { error } = await supabase.rpc("dodaj_prazan_prihod");

    if (error) {
      console.error("Greška pri pozivanju funkcije:", error);
      return res.status(500).json({ error: "Greška pri dodavanju praznog prihoda." });
    }

    res.status(200).json({ message: "Prazan prihod uspješno dodan." });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to add monthly income
app.patch("/parking/mjesecni-prihod", (req, res) => {
  eventEmitter.emit("addMonthlyIncome", res);
});

// Event listener for adding a new user
eventEmitter.on("addUser", async (korisnicko_ime, lozinka, admin, res) => {
  try {
    const { error } = await supabase.rpc("dodaj_osobu", {
      p_korisnicko_ime: korisnicko_ime,
      p_lozinka: lozinka,
      p_admin: admin,
    });

    if (error) {
      console.error("Greška pri dodavanju osobe:", error);
      return res.status(500).json({ error: "Greška pri dodavanju osobe." });
    }

    res.status(201).json({ message: "Osoba uspješno dodana." });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to add a new user
app.post("/osoba/dodaj", (req, res) => {
  const { korisnicko_ime, lozinka, admin } = req.body;
  eventEmitter.emit("addUser", korisnicko_ime, lozinka, admin, res);
});

// Event listener for user login
eventEmitter.on("userLogin", async (korisnicko_ime, lozinka, res) => {
  try {
    const { data, error } = await supabase.rpc("provjeri_korisnika", {
      p_korisnicko_ime: korisnicko_ime,
      p_lozinka: lozinka,
    });

    if (error) {
      console.error("Greška pri provjeri korisnika:", error);
      return res.status(500).json({ error: "Greška pri provjeri korisnika." });
    }

    const { success, message, admin, info_korisnik } = data;

    res.status(200).json({
      success,
      message,
      admin,
      info_korisnik,
    });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route for user login
app.post("/osoba/provjeri", (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;
  eventEmitter.emit("userLogin", korisnicko_ime, lozinka, res);
});

// Event listener for adding a new parking
eventEmitter.on("addParking", async (broj_mjesta, FK_admin, FK_grad, FK_zona, res) => {
  try {
    const { data, error } = await supabase.rpc("dodaj_novi_parking", {
      p_broj_mjesta: broj_mjesta,
      p_fk_admin: FK_admin,
      p_fk_grad: FK_grad,
      p_fk_zona: FK_zona,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: "Parking uspješno dodan!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Greška na serveru." });
  }
});

// Route to add a new parking
app.post("/add-parking", (req, res) => {
  const { broj_mjesta, FK_admin, FK_grad, FK_zona } = req.body;
  eventEmitter.emit("addParking", broj_mjesta, FK_admin, FK_grad, FK_zona, res);
});

// Event listener for updating parking
eventEmitter.on("updateParking", async (id_parkinga, broj_mjesta, FK_admin, FK_grad, FK_zona, res) => {
  try {
    const { error } = await supabase.rpc("azuriraj_parking", {
      p_id_parkinga: id_parkinga,
      p_broj_mjesta: broj_mjesta || null,
      p_fk_admin: FK_admin || null,
      p_fk_grad: FK_grad || null,
      p_fk_zona: FK_zona || null,
    });

    if (error) {
      console.error("Greška pri ažuriranju parkinga:", error);
      return res.status(500).json({ error: "Greška pri ažuriranju parkinga." });
    }

    res.status(200).json({ message: "Parking uspješno ažuriran." });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// Route to update parking
app.patch("/parking/:id", (req, res) => {
  const id_parkinga = parseInt(req.params.id, 10);
  const { broj_mjesta, FK_admin, FK_grad, FK_zona } = req.body;
  eventEmitter.emit("updateParking", id_parkinga, broj_mjesta, FK_admin, FK_grad, FK_zona, res);
});

// Event listener for fetching all parkings
eventEmitter.on('fetchAllParking', async (res) => {
  try {
      const { data, error } = await supabase.rpc('dohvati_sve_parkinge');
      if (error) {
          console.error('Greška pri dohvaćanju parking ID-ova:', error);
          return res.status(500).json({ error: 'Greška pri dohvaćanju parking ID-ova.' });
      }
      res.status(200).json(data);
  } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
  }
});

// Route for fetching all parking lots
app.get('/parking/sve', (req, res) => {
  eventEmitter.emit('fetchAllParking', res);
});

eventEmitter.on('fetchParkingRevenue', async (id_parkinga, res) => {
  try {
      const { data, error } = await supabase.rpc('dohvati_mjesecni_prihod', {
          p_id_parkinga: id_parkinga,
      });

      if (error) {
          console.error('Greška pri dohvaćanju mjesečnog prihoda:', error);
          return res.status(500).json({ error: 'Greška pri dohvaćanju mjesečnog prihoda.' });
      }

      if (!data) {
          return res.status(404).json({ error: 'Parking s navedenim ID-om ne postoji.' });
      }

      res.status(200).json({ mjesecni_prihod: data });
  } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
  }
});

app.get('/parking/prihod/:id_parkinga', (req, res) => {
  eventEmitter.emit('fetchParkingRevenue', req.params.id_parkinga, res);
});

eventEmitter.on('fetchUserTickets', async (korisnicko_ime, res) => {
  try {
      const { data, error } = await supabase.rpc('dohvati_karte_za_korisnika', {
          p_korisnicko_ime: korisnicko_ime,
      });

      if (error) {
          console.error('Greška pri dohvaćanju karata:', error);
          return res.status(500).json({ error: 'Greška pri dohvaćanju karata.' });
      }

      if (!data || data.length === 0) {
          return res.status(404).json({ error: 'Korisnik nema kupljenih karata ili ne postoji.' });
      }

      res.status(200).json({ karte: data });
  } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
  }
});

app.get('/osoba/karte/:korisnicko_ime', (req, res) => {
  eventEmitter.emit('fetchUserTickets', req.params.korisnicko_ime, res);
});

app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});