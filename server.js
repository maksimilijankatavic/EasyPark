const express = require("express");
const supabase = require("./supabaseClient.js");

const app = express();
const port = 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

// ********** Podaci o parkingu, uključujući slobodna mjesta, cijenu i zonu
app.get("/parking/podaci/:id", async (req, res) => {
  const parkingId = parseInt(req.params.id, 10);

  if (isNaN(parkingId)) {
    return res.status(400).json({ error: "Neispravan parking ID." });
  }

  try {
    const { data: parkingData, error: parkingError } = await supabase.rpc(
      "dohvati_podatke_parkinga",
      {
        p_id_parkinga: parkingId,
      }
    );

    if (parkingError) {
      console.error(
        "Greška pri dohvaćanju podataka o parkingu:",
        parkingError.message
      );
      return res
        .status(500)
        .json({ error: "Greška pri dohvaćanju podataka o parkingu." });
    }

    if (!parkingData || parkingData.length === 0) {
      return res.status(404).json({ error: "Parking nije pronađen." });
    }

    const { data: slobodnaMjestaData, error: slobodnaMjestaError } =
      await supabase.rpc("slobodna_mjesta", {
        parking_id: parkingId,
      });

    if (slobodnaMjestaError) {
      console.error(
        "Greška pri dohvaćanju slobodnih mjesta:",
        slobodnaMjestaError.message
      );
      return res
        .status(500)
        .json({ error: "Greška pri dohvaćanju slobodnih mjesta." });
    }

    const slobodnaMjesta = slobodnaMjestaData[0]?.slobodna_mjesta;

    if (slobodnaMjesta === undefined) {
      return res
        .status(500)
        .json({ error: "Neispravan odgovor RPC funkcije za slobodna mjesta." });
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

//  ********** broj slobodnih mjesta
app.get("/slobodna-mjesta/:id", async (req, res) => {
  const parkingId = parseInt(req.params.id, 10);

  if (isNaN(parkingId)) {
    return res.status(400).json({ error: "Neispravan parking ID." });
  }

  try {
    const { data, error } = await supabase.rpc("slobodna_mjesta", {
      parking_id: parkingId,
    });
    if (error) {
      return res
        .status(500)
        .json({ error: "Greška prilikom dohvaćanja podataka" });
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

// ********** kupovina karte ili ažuriranje vremena isteka
app.post("/kupljena-karta", async (req, res) => {
  const { voziloId, parkingId, vrijemeIsteka } = req.body;

  try {
    const { data: vehicleExists, error: vehicleCheckError } = await supabase
      .from("Vozila")
      .select("id_registarska_ozn")
      .eq("id_registarska_ozn", voziloId)
      .single();

    if (vehicleCheckError && vehicleCheckError.code !== "PGRST116") {
      console.error("Error checking vehicle existence:", vehicleCheckError);
      return res
        .status(500)
        .json({ error: "Error checking vehicle existence." });
    }

    if (!vehicleExists) {
      const { error: addVehicleError } = await supabase.rpc(
        "dodaj_novo_vozilo",
        {
          p_id_registarska_ozn: voziloId,
          p_fk_korisnik: null,
        }
      );

      if (addVehicleError) {
        console.error("Error adding vehicle:", addVehicleError);
        return res.status(500).json({ error: "Error adding vehicle." });
      }
    }

    const { error: ticketError } = await supabase.rpc(
      "dodaj_ili_azuriraj_kupljena_karta",
      {
        p_fk_vozilo: voziloId,
        p_fk_parking: parkingId,
        p_vrijeme_isteka: vrijemeIsteka,
      }
    );

    if (ticketError) {
      console.error("Error adding/updating ticket:", ticketError);
      return res
        .status(500)
        .json({ error: "Error adding or updating the ticket." });
    }

    return res.json({ message: "Ticket successfully added or updated." });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error occurred." });
  }
});

// ********** brisanje kupljene karte
app.delete("/kupljena-karta/:voziloId", async (req, res) => {
  const { voziloId } = req.params;

  try {
    const { data: vehicleExists, error: vehicleCheckError } = await supabase
      .from("Kupljene_karte")
      .select("FK_vozilo")
      .eq("FK_vozilo", voziloId)
      .single();

    if (vehicleCheckError && vehicleCheckError.code !== "PGRST116") {
      console.error("Error checking vehicle existence:", vehicleCheckError);
      return res
        .status(500)
        .json({ error: "Error checking vehicle existence." });
    }

    if (!vehicleExists) {
      return res
        .status(404)
        .json({ message: "Ticket doesn't exist." });
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

// ********** dodavanje vozila

app.post("/vozilo/dodaj", async (req, res) => {
  const { idRegistarskaOzn, fkKorisnik } = req.body;

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

//********** podaci o parkingu i zonama
app.get("/parking/zona/:id", async (req, res) => {
  const parkingId = parseInt(req.params.id);

  if (isNaN(parkingId)) {
    return res.status(400).json({ error: "Neispravan ID parkinga." });
  }

  try {
    const { data, error } = await supabase.rpc("dohvati_podatke_parkinga", {
      p_id_parkinga: parkingId,
    });

    if (error) {
      console.error(
        "Greška pri dohvaćanju podataka o parkingu:",
        error.message
      );
      return res
        .status(500)
        .json({ error: "Greška pri dohvaćanju podataka o parkingu." });
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

// ************ ažuriranje prihoda
app.put("/parking/prihod", async (req, res) => {
  const { idParking, iznos } = req.body;

  if (!idParking || !iznos) {
    return res
      .status(400)
      .json({ error: "Nedostaju potrebni parametri: idParking i iznos." });
  }

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

// ************ dodavanje praznog prihoda na kraj mjeseca
app.patch("/parking/mjesecni-prihod", async (req, res) => {
  try {
    const { error } = await supabase.rpc("dodaj_prazan_prihod");

    if (error) {
      console.error("Greška pri pozivanju funkcije:", error);
      return res
        .status(500)
        .json({ error: "Greška pri dodavanju praznog prihoda." });
    }

    res.status(200).json({ message: "Prazan prihod uspješno dodan." });
  } catch (err) {
    console.error("Nepoznata greška:", err);
    res.status(500).json({ error: "Nepoznata greška." });
  }
});

// *********** prijava novog korisnika (signup)
app.post('/osoba/dodaj', async (req, res) => {
  const { korisnicko_ime, lozinka, admin } = req.body;

  try {
      const { error } = await supabase.rpc('dodaj_osobu', {
          p_korisnicko_ime: korisnicko_ime,
          p_lozinka: lozinka,
          p_admin: admin,
      });

      if (error) {
          console.error('Greška pri dodavanju osobe:', error);
          return res.status(500).json({ error: 'Greška pri dodavanju osobe.' });
      }

      res.status(201).json({ message: 'Osoba uspješno dodana.' });
  } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
  }
});

// *************prijava postojećeg korisnika (login)
app.get('/osoba/provjeri', async (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;

  try {
      const { data, error } = await supabase.rpc('provjeri_korisnika', {
          p_korisnicko_ime: korisnicko_ime,
          p_lozinka: lozinka,
      });

      if (error) {
          console.error('Greška pri provjeri korisnika:', error);
          return res.status(500).json({ error: 'Greška pri provjeri korisnika.' });
      }

      res.status(200).json(data);
  } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
  }
});

app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});
