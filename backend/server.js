// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL-tilkobling (Docker eller lokal MySQL)
const db = mysql.createPool({
  host: 'localhost',     // Docker: 'localhost' eller container-navn
  user: 'user',          // fra docker-compose eller MySQL
  password: 'userpass',  // fra docker-compose eller MySQL
  database: 'favoritdb'  // databasen du lager
});

// Test-rute
app.get('/', (req, res) => {
  res.send('Backend fungerer! 🚀');
});

// Hent alle favoritter
app.get('/favorites', (req, res) => {
  db.query('SELECT * FROM favorites', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Legg til favoritt
app.post('/favorites', (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: 'Navn og type må fylles ut' });
  }

  db.query(
    'INSERT INTO favorites (name, type) VALUES (?, ?)',
    [name, type],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: results.insertId, name, type });
    }
  );
});

// Slette favoritt etter ID
app.delete('/favorites/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM favorites WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Favoritt slettet' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});
