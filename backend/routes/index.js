const express = require('express');
const authRoutes = require('./auth');
const chatRoutes = require('./chat');
const postsRoute = require('./posts');

const router = express.Router();

router.use('/auth', authRoutes); // Prefix for authentication routes
router.use('/chat', chatRoutes); // Prefix for chat routes
router.use('/posts', postsRoute); // Prefix for posts routes

module.exports = router;
