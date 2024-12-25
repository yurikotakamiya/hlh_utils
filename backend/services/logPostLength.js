const pool = require('./db');

async function logPostLength(postId, length) {
    const client = await pool.connect();
    try {
        await client.query(
            'INSERT INTO post_lengths (post_id, length) VALUES ($1, $2)',
            [postId, length]
        );
        console.log(`Logged length for post ${postId}: ${length}`);
    } catch (err) {
        console.error(`Error logging length for post ${postId}:`, err.message);
    } finally {
        client.release();
    }
}

module.exports = logPostLength;