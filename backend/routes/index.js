const express = require('express');
const authRoutes = require('./auth');
const chatRoutes = require('./chat');

const router = express.Router();

router.use('/auth', authRoutes); // Prefix for authentication routes
router.use('/chat', chatRoutes); // Prefix for chat routes

module.exports = router;
