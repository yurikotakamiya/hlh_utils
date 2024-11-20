// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  } finally {
    client.release();
  }
});

app.get('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    res.send(result.rows[0]);
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});