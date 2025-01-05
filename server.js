const express = require('express');
const supabase = require('./supabaseClient.js');

const app = express();
const port = 3000;

app.use(express.json());



app.listen(port, () => {
  console.log(`Server radi na http://localhost:${port}`);
});

