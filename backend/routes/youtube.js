const express = require('express');
const { getSubtitles } = require('youtube-captions-scraper');
const youtubeTranscribeWithGPT = require('../services/youtubeTranscribeWithGPT');
const ollama = require('../services/youtubeTranscribeWithOllama');
const router = express.Router();

router.post('/summary', async (req, res) => {
    const { url, language, summarizer = 'gpt', model = 'gpt-3.5-turbo' } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'YouTube URL is required.' });
    }
    if (!language) {
        return res.status(400).json({ error: 'Subtitle language is required.' });
    }

    try {
        const videoId = extractYouTubeID(url);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL.' });
        }

        console.log('Extracted Video ID:', videoId);

        let subtitles = null;
        try {
            subtitles = await getSubtitles({ videoID: videoId, lang: language });
            if (!subtitles || subtitles.length === 0) {
                return res.status(404).json({ error: `No subtitles found for language: ${language}` });
            }
        } catch (error) {
            console.error(`Error fetching subtitles: ${error.message}`);
            return res.status(500).json({ error: 'Failed to fetch subtitles. Please try again later.' });
        }

        // Combine subtitles into a single transcript
        const transcript = subtitles.map((item) => item.text).join(' ');

        // Summarize based on user-selected summarizer
        let summary;
        if (summarizer === 'gpt') {
            summary = await youtubeTranscribeWithGPT(transcript, model);
        } else if (summarizer === 'ollama') {
            summary = await ollama(transcript);
        } else {
            return res.status(400).json({ error: 'Invalid summarizer selected. Use "gpt" or "ollama".' });
        }

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error summarizing YouTube video:', error.message);
        res.status(500).json({ error: 'Failed to summarize the video. Please try again.' });
    }
});

const extractYouTubeID = (url) => {
    console.log('Extracting video ID from URL:', url);
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    console.log('Extracted Video ID:', videoId);
    return videoId;
};

module.exports = router;
