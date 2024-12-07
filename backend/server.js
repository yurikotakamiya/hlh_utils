require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { expressjwt: expressJwt } = require('express-jwt');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(cors());
app.use(bodyParser.json());

// Authentication middleware
const authenticate = expressJwt({ secret: JWT_SECRET, algorithms: ['HS256'] }).unless({ path: ['/auth/login', '/auth/register', '/'] });
app.use(authenticate);

// Load routes
app.use('/', routes);

// Error handler
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    next(err);
});

// Server start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
