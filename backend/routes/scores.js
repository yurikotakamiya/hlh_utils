const express = require('express');
const pool = require('../services/db');
const router = express.Router();

/**
 * Route to submit or update scores for a user.
 */
router.post('/', async (req, res) => {
    const { user_id, date, scores, comment } = req.body;

    if (!user_id || !date || !scores) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const columns = Object.keys(scores).map((col, index) => `col_${index + 1}`).join(', ');
    const values = Object.values(scores);

    try {
        const query = `
            INSERT INTO scores (user_id, date, ${columns}, comment)
            VALUES ($1, $2, ${values.map((_, i) => `$${i + 3}`).join(', ')}, $${values.length + 3})
            ON CONFLICT (user_id, date)
            DO UPDATE SET
                ${columns.split(', ').map((col, i) => `${col} = EXCLUDED.${col}`).join(', ')},
                comment = EXCLUDED.comment
            RETURNING *;
        `;

        const result = await pool.query(query, [user_id, date, ...values, comment]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * Route to update column names for a user.
 */
router.put('/score-column-names', async (req, res) => {
    const { user_id, column_names } = req.body;

    if (!user_id || !column_names || Object.keys(column_names).length > 10) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const queries = Object.entries(column_names).map(([col, name]) =>
            pool.query(
                `
                INSERT INTO score_column_names (user_id, col_name, friendly_name)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, col_name)
                DO UPDATE SET friendly_name = EXCLUDED.friendly_name
                `,
                [user_id, col, name]
            )
        );

        await Promise.all(queries);
        res.status(200).json({ message: 'Column names updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * Route to fetch scores for a user.
 */
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT * FROM scores WHERE user_id = $1
        `, [user_id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * Route to fetch column names for a user.
 */
router.get('/score-column-names/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT col_name, friendly_name FROM score_column_names WHERE user_id = $1
        `, [user_id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
