const express = require('express');
const pool = require('../services/db');
const router = express.Router();

// Get all memos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM family_memos WHERE archive = FALSE ORDER BY date DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a new memo
router.post('/', async (req, res) => {
    const { memo, date } = req.body;

    if (!memo) {
        return res.status(400).json({ error: 'Memo is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO family_memos (memo, date) VALUES ($1, $2) RETURNING *',
            [memo, date || new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Archive a memo
router.put('/:id/archive', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE family_memos SET archive = TRUE WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Memo not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get archived memos
router.get('/archived', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM family_memos WHERE archive = TRUE ORDER BY date DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
