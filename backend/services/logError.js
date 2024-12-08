const pool = require('./db'); // Import the database connection pool

async function logError(level, message, url = null) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO logs (level, message, url) VALUES ($1, $2, $3)', [level, message, url]);
        console.log(`Error logged: [${level}] ${message}`);
    } catch (err) {
        console.error('Failed to log error:', err.message);
    } finally {
        client.release();
    }
}

module.exports = logError;
