const fetchTitles = require('../services/fetchTitles');
const fetchContent = require('../services/fetchContent');
const filterContentWithOllama = require('../services/filterContentWithOllama');
const isPostIdInDatabase = require('../services/isPostIdInDatabase');
const pool = require('../services/db'); // Database connection

async function getKeywords() {
    try {
        const result = await pool.query('SELECT word FROM keywords');
        return result.rows.map(row => row.word);
    } catch (err) {
        console.error('Error fetching keywords:', err.message);
        return [];
    }
}

async function scrapeAndDownload() {
    const keywords = await getKeywords(); // Fetch keywords from DB

    for (let page = 1; page <= 10; page++) {
        try {
            console.log(`Fetching titles from page ${page}...`);
            const titles = await fetchTitles(page);

            console.log(`Found ${titles.length} posts on page ${page}.`);

            for (const post of titles) {
                const postId = post.link.split('/').pop(); // Extract post ID from URL
                // if post_id is already in the database, skip
                if (await isPostIdInDatabase(postId)) {
                    console.log(`Post ${postId} is already in the database.`);
                    continue;
                }

                try {
                    const content = await fetchContent(post, postId, false);

                    const isRelevant = await filterContentWithOllama(content, keywords);
                    console.log('searching with keywords:', keywords);
                    if (isRelevant) {
                        await fetchContent(post, postId, true);
                        console.log(`Post ${postId} is relevant and saved.`);
                    } else {
                        console.log(`Post ${postId} is not relevant and skipped.`);
                    }
                } catch (err) {
                    console.error(`Error processing post ${postId}:`, err.message);
                }

                await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 3000));
            }
        } catch (err) {
            console.error(`Error processing page ${page}:`, err.message);
        }
    }
}

scrapeAndDownload();
