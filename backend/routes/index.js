const express = require('express');
const authRoutes = require('./auth');
const chatRoutes = require('./chat');
const postsRoute = require('./posts');
const commentsRoute = require('./comments'); // Import comments route
const scoresRoute = require('./scores'); // Import scores route

const router = express.Router();

router.use('/auth', authRoutes); // Prefix for authentication routes
router.use('/chat', chatRoutes); // Prefix for chat routes
router.use('/posts', postsRoute); // Prefix for posts routes
router.use('/comments', commentsRoute); // Prefix for comments routes
router.use('/scores', scoresRoute); // Prefix for scores routes

module.exports = router;
