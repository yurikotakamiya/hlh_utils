const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Fetch grouped posts by date
router.get('/', (req, res) => {
    const metaDir = path.join(__dirname, '../data/ilbe-meta');

    try {
        const dates = fs.readdirSync(metaDir);
        const groupedPosts = dates.map((date) => {
            const dateMetaDir = path.join(metaDir, date);
            const datePosts = fs.readdirSync(dateMetaDir).map((file) => {
                return JSON.parse(
                    fs.readFileSync(path.join(dateMetaDir, file), 'utf8')
                );
            });
            return { date, posts: datePosts };
        });

        res.json(groupedPosts);
    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Serve raw HTML content by date and filename
router.get('/:date/:filename', (req, res) => {
    const { date, filename } = req.params;
    const filePath = path.join(__dirname, `../data/ilbe-posts/${date}/${filename}`);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(content);
    } catch (err) {
        console.error(`Error serving file: ${filePath}`, err.message);
        res.status(404).json({ error: 'File not found' });
    }
});

module.exports = router;
