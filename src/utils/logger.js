const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const loggerTransports = [
    // LEVEL 2 LOGS → console
    new transports.Console({
        level: 'debug',       // 3nd-level logs
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    })
];

// Only add MongoDB transport if MONGO_URI is provided
if (process.env.MONGO_URI) {
    loggerTransports.push(
        new transports.MongoDB({
            level: 'warn',         // 1st-level logs
            db: process.env.MONGO_URI,
            collection: 'app_logs',    // your log collection name
            tryReconnect: true,
            options: {
                useUnifiedTopology: true
            }
        })
    );
}

const logger = createLogger({
    level: 'info', // minimum level accepted
    format: format.combine(
        format.timestamp({
        format: () =>
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    }),
        format.json()
    ),  
    transports: loggerTransports
});

module.exports = logger;