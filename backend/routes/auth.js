const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../services/decrypt');
const pool = require('../services/db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with your own secret
const tokenBlacklist = new Set();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const decryptedPassword = decrypt(password);
        const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const decryptedPassword = decrypt(password);
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(decryptedPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '12h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Error logging in user' });
    }
});

router.post('/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    tokenBlacklist.add(token);
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
