const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchComments(postId, date, maxPage) {
    console.log(`Fetching comments for post ${postId}, max page: ${maxPage}...`);
    const sanitizedPostId = postId.split('?')[0];
    const commentDir = path.join(__dirname, `../data/ilbe-comments/${date}`);
    fs.mkdirSync(commentDir, { recursive: true });

    let page = 0;
    let hasMoreComments = true;

    // File to save the combined HTML
    const commentFilePath = path.join(commentDir, `post-${sanitizedPostId}-comments.html`);
    let combinedHtml = '';

    while (page <= maxPage && hasMoreComments) {
        try {
            const url = `https://www.ilbe.com/commentlist/${sanitizedPostId}?page=${page}`;
            console.log(`Fetching comments from ${url}...`);

            const response = await axios.get(url, {
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
            });

            const html = response.data;

            if (html.includes('<div id="cmt_')) {
                combinedHtml += html; // Append the page's HTML to the combined HTML
                page += 1;
            } else {
                hasMoreComments = false; // Stop if no more comments
            }

            // Optional: Limit to prevent excessive requests
            if (page === 5) {
                hasMoreComments = false;
            }
        } catch (err) {
            console.error(`Error fetching comments for post ${postId} on page ${page}:`, err.message);
            hasMoreComments = false; // Stop fetching on error
        }
    }

    if (combinedHtml) {
        // Save the combined HTML to a file
        fs.writeFileSync(commentFilePath, combinedHtml, 'utf8');
        console.log(`Comments for post ${postId} saved successfully.`);
    } else {
        console.log(`No comments found for post ${postId}.`);
    }
}

module.exports = fetchComments;
