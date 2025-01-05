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

app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});

