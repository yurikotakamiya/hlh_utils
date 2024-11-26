require('dotenv').config();
const axios = require('axios');
const MarkdownIt = require('markdown-it');
const { htmlToText } = require('html-to-text');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8000;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with your own secret
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your_encryption_key'; // Replace with your own encryption key
const tokenBlacklist = new Set();

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydatabase',
    password: 'password',
    port: 5432,
});

const authenticate = expressJwt({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({ path: ['/login', '/register', '/'] });

app.use(authenticate);

function decrypt(text) {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'base64');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Decryption failed');
    }
}

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send('Error registering user');
    } finally {
        client.release();
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const decryptedPassword = decrypt(password);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
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
    } finally {
        client.release();
    }
});

app.post('/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    tokenBlacklist.add(token);
    res.status(200).json({ message: 'Logout successful' });
});

// ChatGPT API endpoint using GPT-4o
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: req.body.mode,
                messages: [{ role: 'user', content: userInput }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        
        // Convert GPT's Markdown response to HTML using markdown-it
        const md = new MarkdownIt();
        const htmlMessage = md.render(response.data.choices[0].message.content);

        // Convert HTML to plain text
        const plainTextMessage = htmlToText(htmlMessage, {
            wordwrap: false,
            selectors: [
                { selector: 'a', options: { ignoreHref: true } },
                { selector: 'img', format: 'skip' }
            ]
        });

        res.json({ message: plainTextMessage }); // Send HTML to frontend
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.message);
        res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
    }
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    next(err);
});

app.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT NOW()');
        res.send(result.rows[0]);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});