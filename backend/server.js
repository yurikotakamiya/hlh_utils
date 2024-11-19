// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'mydatabase',
  password: 'password',
  port: 5432,
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