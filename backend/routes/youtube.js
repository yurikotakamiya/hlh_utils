const express = require('express');
const { getSubtitles } = require('youtube-captions-scraper');
const ollama = require('../services/youtubeTranscribeWithOllama');
const router = express.Router();

router.post('/summary', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'YouTube URL is required' });
    }

    try {
        const videoId = extractYouTubeID(url);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL.' });
        }

        console.log('Extracted Video ID:', videoId);

        // Predefined list of languages to try
        const languageCodes = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko']; // Add more as needed

        let subtitles = null;

        // Attempt to fetch subtitles in predefined languages
        for (const lang of languageCodes) {
            try {
                subtitles = await getSubtitles({
                    videoID: videoId,
                    lang: lang,
                });
                if (subtitles && subtitles.length > 0) {
                    console.log(`Fetched subtitles in language: ${lang}`);
                    break; // Exit the loop if subtitles are found
                }
            } catch (error) {
                console.warn(`Failed to fetch subtitles for language: ${lang}`);
            }
        }

        if (!subtitles || subtitles.length === 0) {
            return res.status(404).json({ error: 'No subtitles could be fetched for the predefined languages.' });
        }

        // Combine subtitles into a single text block
        const transcript = subtitles.map((item) => item.text).join(' ');
        console.log('Combined Subtitles:', transcript);
        // Summarize with Ollama
        const summary = await ollama(transcript);
        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error summarizing YouTube video:', error);
        res.status(500).json({ error: 'Failed to summarize the video. Please try again.' });
    }
});

const extractYouTubeID = (url) => {
    console.log('Extracting video ID from URL:', url);
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    console.log('Extracted video ID:', videoId);
    return videoId;
};

module.exports = router;
