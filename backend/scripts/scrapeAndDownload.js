const fetchTitles = require('../services/fetchTitles');
const filterTitles = require('../services/filterTitles');
const fetchContent = require('../services/fetchContent');

async function scrapeAndDownload() {
    for (let page = 1; page <= 10; page++) {
        try {
            console.log(`Fetching titles from page ${page}...`);
            const titles = await fetchTitles(page);
            const filteredTitles = filterTitles(titles);

            console.log(`Found ${filteredTitles.length} relevant posts on page ${page}.`);

            for (const post of filteredTitles) {
                const postId = post.link.split('/').pop(); // Extract post ID from URL
                await fetchContent(post, postId);
                await new Promise((resolve) => setTimeout(resolve, 5000 + Math.random() * 3000)); // Random delay
            }
        } catch (err) {
            console.error(`Error processing page ${page}:`, err.message);
        }
    }
}

scrapeAndDownload();
