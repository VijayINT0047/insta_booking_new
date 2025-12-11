// Load Environment Variables
require('dotenv').config();

// Core Modules & Third-Party Packages
const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');

// Local Modules
const apiLimiter = require('./middlewares/rateLimiter');
const traceMiddleware = require('./middlewares/trace.middleware');
const routes = require('./routes');

// Initialize App
const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(apiLimiter); // rate limiter
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// tracing middleware (must be before routes)
app.use(traceMiddleware);

// Routes
app.use('/api', routes);

// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', traceId: req.traceId });
});

module.exports = app;
