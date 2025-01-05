const express = require('express');
const supabase = require('./supabaseClient.js');

const app = express();
const port = 3000;

app.use(express.json());

//  ********** broj slobodnih mjesta
app.get('/slobodna-mjesta/:id', async (req, res) => { 
    const parkingId = parseInt(req.params.id, 10);
  
    if (isNaN(parkingId)) {
      return res.status(400).json({ error: 'Neispravan parking ID.' });
    }
  
    try {
      const { data, error } = await supabase.rpc('slobodna_mjesta', { parking_id: parkingId } );
      if (error) {
        return res.status(500).json({ error: 'Greška prilikom dohvaćanja podataka' });
      }
  
      const slobodnaMjesta = data[0]?.slobodna_mjesta; 
      if (slobodnaMjesta === undefined) {
        return res.status(500).json({ error: 'Neispravan odgovor RPC funkcije' });
      }
      res.json({ slobodna_mjesta: slobodnaMjesta });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Nepoznata greška' });
    }
  });

 // ********** kupovina karte ili ažuriranje vremena isteka
 app.post('/kupljena-karta', async (req, res) => {
    const { voziloId, parkingId, vrijemeIsteka } = req.body;
  
    try {
      // Poziv RPC funkcije za dodavanje ili ažuriranje
      const { error } = await supabase.rpc('dodaj_ili_azuriraj_kupljena_karta', {
        p_fk_vozilo: voziloId,
        p_fk_parking: parkingId,
        p_vrijeme_isteka: vrijemeIsteka,
      });
  
      if (error) {
        console.error('Greška pri pozivanju funkcije:', error);
        return res.status(500).json({ error: 'Greška pri dodavanju ili ažuriranju karte.' });
      }
  
      return res.json({ message: 'Karta je uspješno dodana ili ažurirana.' });
    } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
    }
  });


  // ********** brisanje kupljene karte
app.delete('/kupljena-karta/:voziloId', async (req, res) => {
    const { voziloId } = req.params;
  
    try {
      // Poziv RPC funkcije za brisanje
      const { error } = await supabase.rpc('obrisi_kupljenu_kartu', {
        p_fk_vozilo: voziloId,
      });
  
      if (error) {
        console.error('Greška pri pozivanju funkcije:', error);
        return res.status(500).json({ error: 'Greška pri brisanju karte.' });
      }
  
      return res.json({ message: 'Karta je uspješno obrisana.' });
    } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
    }
  });

  
  // ********** dodavanje vozila
  
  app.post('/vozilo/dodaj', async (req, res) => {
    const { idRegistarskaOzn, fkKorisnik } = req.body;
  
    try {
      // Poziv RPC funkcije
      const { error } = await supabase.rpc('dodaj_novo_vozilo', {
        p_id_registarska_ozn: idRegistarskaOzn,
        p_fk_korisnik: fkKorisnik,
      });
  
      if (error) {
        console.error('Greška pri dodavanju vozila:', error.message);
        return res.status(500).json({ error: 'Greška pri dodavanju vozila.' });
      }
  
      res.status(201).json({ message: 'Vozilo uspješno dodano.' });
    } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
    }
  });

//********** podaci o parkingu i zonama
  app.get('/parking/zona/:id', async (req, res) => {
    const parkingId = parseInt(req.params.id);
  
    if (isNaN(parkingId)) {
      return res.status(400).json({ error: 'Neispravan ID parkinga.' });
    }
  
    try {
      const { data, error } = await supabase.rpc('dohvati_podatke_parkinga', {
        p_id_parkinga: parkingId,
      });
  
      if (error) {
        console.error('Greška pri dohvaćanju podataka o parkingu:', error.message);
        return res.status(500).json({ error: 'Greška pri dohvaćanju podataka o parkingu.' });
      }
  
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Parking nije pronađen.' });
      }
  
      res.json(data);
    } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
    }
  });

  // ************ ažuriranje prihoda
app.put('/parking/prihod', async (req, res) => {
    const { idParking, iznos } = req.body;
  
    if (!idParking || !iznos) {
      return res.status(400).json({ error: 'Nedostaju potrebni parametri: idParking i iznos.' });
    }
  
    try {
      const { error } = await supabase.rpc('azuriraj_prihod', {
        p_id_parkinga: idParking,
        p_iznos: iznos,
      });
  
      if (error) {
        console.error('Greška pri pozivanju funkcije:', error);
        return res.status(500).json({ error: 'Greška pri ažuriranju prihoda.' });
      }
  
      res.status(200).json({ message: 'Prihod uspješno ažuriran.' });
    } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
    }
  });
  

// ************ dodavanje praznog prihoda na kraj mjeseca
app.patch('/parking/mjesecni-prihod', async (req, res) => {
    try {
      const { error } = await supabase.rpc('dodaj_prazan_prihod');
  
      if (error) {
        console.error('Greška pri pozivanju funkcije:', error);
        return res.status(500).json({ error: 'Greška pri dodavanju praznog prihoda.' });
      }
  
      res.status(200).json({ message: 'Prazan prihod uspješno dodan.' });
    } catch (err) {
      console.error('Nepoznata greška:', err);
      res.status(500).json({ error: 'Nepoznata greška.' });
    }
  });

app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});

