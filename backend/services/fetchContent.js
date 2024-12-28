const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const logError = require('./logError'); // Error logging service
const fetchComments = require('./fetchComments'); // Comment extraction service
const logPostLength = require('./logPostLength'); // Post length logging service

async function fetchContent(post, postId, download=false) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const postDir = path.join(__dirname, `../data/ilbe-posts/${today}`);
    const metaDir = path.join(__dirname, `../data/ilbe-meta/${today}`);
    const imageDir = path.join(__dirname, `../data/ilbe-images/${today}`);

    // Ensure directories exist
    fs.mkdirSync(postDir, { recursive: true });
    fs.mkdirSync(metaDir, { recursive: true });
    fs.mkdirSync(imageDir, { recursive: true });

    const sanitizedPostId = postId.split('?')[0]; // Clean up postId

    try {
        const response = await axios.get(post.link, {
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
        });

        const $ = cheerio.load(response.data);

        // Fix image src attributes
        $('img').each((_, img) => {
            const dataSrc = $(img).attr('data'); // Get the data attribute
            if (dataSrc) {
                $(img).attr('src', dataSrc); // Replace src with the data attribute
            }
        });
        // Fixing href attributes
        $('a').each((_, element) => {
            const href = $(element).attr('href');
            if (href && !href.startsWith('http')) {
                // Resolve relative URLs to absolute URLs
                const absoluteUrl = new URL(href, post.link).toString();
                $(element).attr('href', absoluteUrl);
            }
        });

        // Extract HTML content
        const content = $('.post-content').html();
        if (!content) {
            throw new Error(`No content found for post ${sanitizedPostId}`);
        }
        const contentLength = content.length;
        await logPostLength(sanitizedPostId, contentLength);
        if (!download) {
            return content;
        }
        // Save HTML content
        const postFilePath = path.join(postDir, `post-${sanitizedPostId}.html`);
        fs.writeFileSync(postFilePath, content, 'utf8');

        // Determine the maximum number of comment pages
        let maxCommentPage = 0;
        $('.paginate a').each((_, element) => {
            const pageNum = parseInt($(element).text().trim(), 10);
            if (!isNaN(pageNum) && pageNum > maxCommentPage) {
                maxCommentPage = pageNum;
            }
        });

        await fetchComments(sanitizedPostId, today, maxCommentPage); // Pass both $ and commentsHtml

        // Initialize metadata
        const metadata = {
            id: sanitizedPostId,
            title: post.title,
            link: post.link,
            date: today,
            images: [],
        };

        // Extract and download images
        $('.post-content img').each(async (_, img) => {
            let imageUrl = $(img).attr('data') || $(img).attr('src'); // Prefer `data` attribute, fallback to `src`

            // Skip invalid URLs
            if (!imageUrl || imageUrl.startsWith('http') === false) {
                await logError('ERROR', `Invalid image URL for post ${sanitizedPostId}: ${imageUrl}`, post.link);
                return;
            }

            try {
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageFileName = `post-${sanitizedPostId}-${path.basename(imageUrl)}`;
                const imageFilePath = path.join(imageDir, imageFileName);

                // Save the image
                fs.writeFileSync(imageFilePath, imageResponse.data);
                console.log(`Image saved: ${imageFilePath}`);

                // Add the image path to metadata
                metadata.images.push(`/data/ilbe-images/${today}/${imageFileName}`);
            } catch (imageErr) {
                await logError('ERROR', `Failed to download image for post ${sanitizedPostId}: ${imageErr.message}`, imageUrl);
            }
        });

        // Save metadata (title, link, and images)
        const metaFilePath = path.join(metaDir, `post-${sanitizedPostId}.json`);
        fs.writeFileSync(metaFilePath, JSON.stringify(metadata, null, 2), 'utf8');

        console.log(`Post ${sanitizedPostId} saved successfully.`);
    } catch (err) {
        console.error(`Error fetching content for post ${sanitizedPostId}:`, err.message);
        await logError('ERROR', `Failed to fetch content for post ${sanitizedPostId}: ${err.message}`, post.link);
    }
}

module.exports = fetchContent;
