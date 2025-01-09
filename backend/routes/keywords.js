const express = require('express');
const pool = require('../services/db');
const router = express.Router();

// Fetch all keywords
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM keywords ORDER BY word');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a new keyword
router.post('/', async (req, res) => {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: 'Keyword is required' });

    try {
        const result = await pool.query('INSERT INTO keywords (word) VALUES ($1) RETURNING *', [word]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // UNIQUE constraint violation
            return res.status(400).json({ error: 'Keyword already exists' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a keyword
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM keywords WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Keyword not found' });
        }
        res.json({ message: 'Keyword deleted', deleted: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
