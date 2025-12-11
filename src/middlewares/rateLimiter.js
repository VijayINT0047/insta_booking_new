const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger"); // your winston file
const maxLimit = process.env.RATE_LIMIT_MAX ;
const rateWindowMS = process.env.RATES_WINDOW_MS

const apiLimiter = rateLimit({
    windowMs: Number(rateWindowMS) ||  5 * 60 * 1000,
    max: Number(maxLimit) ||  5,
    handler: (req, res) => {
        logger.warn("Rate limit exceeded", {
            ip: req.ip,
            route: req.originalUrl,
        });

        res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Try again later."
        });
    },
});

module.exports = apiLimiter;
