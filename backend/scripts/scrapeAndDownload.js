const fetchTitles = require('../services/fetchTitles');
const fetchContent = require('../services/fetchContent');
const filterContentWithOllama = require('../services/filterContentWithOllama');
const isPostIdInDatabase = require('../services/isPostIdInDatabase');

async function scrapeAndDownload() {
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
                    // Fetch post content
                    const content = await fetchContent(post, postId, false);

                    // Filter post content using GPT/Ollama
                    const isRelevant = await filterContentWithOllama(content, [
                        '금리', '코인', '건강', '금융', '시장', '19', 'manhwa', '인공지능', '개발',
                    ]);

                    if (isRelevant) {
                        await fetchContent(post, postId, true); // 
                        console.log(`Post ${postId} is relevant and saved.`);
                    } else {
                        console.log(`Post ${postId} is not relevant and skipped.`);
                    }
                } catch (err) {
                    console.error(`Error processing post ${postId}:`, err.message);
                }

                // Random delay to avoid being blocked
                await new Promise((resolve) => setTimeout(resolve, 5000 + Math.random() * 3000));
            }
        } catch (err) {
            console.error(`Error processing page ${page}:`, err.message);
        }
    }
}

scrapeAndDownload();
