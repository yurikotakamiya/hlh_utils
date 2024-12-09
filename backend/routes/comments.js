const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Serve raw HTML comments by date and post ID
router.get('/:date/:filename', (req, res) => {
    const { date, filename } = req.params;
    const filePath = path.join(__dirname, `../data/ilbe-comments/${date}/${filename}`);

    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const content = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(content);
    } catch (err) {
        console.error(`Error serving comment file: ${filePath}`, err.message);
        res.status(404).json({ error: 'File not found' });
    }
});

module.exports = router;
