const pool = require('./db');

async function isPostIdInDatabase(postId) {
    try {
        const query = 'SELECT COUNT(*) FROM post_lengths WHERE post_id = $1';
        const values = [postId];

        const result = await pool.query(query, values);

        return parseInt(result.rows[0].count, 10) > 0;
    } catch (err) {
        console.error('Error checking post ID in database:', err.message);
        throw err;
    }
}

module.exports = isPostIdInDatabase;
