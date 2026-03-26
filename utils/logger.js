const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

// 🔹 Custom log format
const logFormat = winston.format.printf((info) => {
    const { level, message, timestamp, stack, ...meta } = info;
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message} ${metaString}`;
});

// 🔹 Reusable combined transport
const combinedTransport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, "../logs/combined/combined-%DATE%.log"),
    datePattern: "DD-MM-YYYY",
    maxSize: "20m",
    maxFiles: "14d"
});

// 🔹 Create logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        logFormat
    ),
    transports: [
        // INFO LOGS
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, "../logs/info/info-%DATE%.log"),
            level: "info",
            datePattern: "DD-MM-YYYY",
            maxSize: "20m",
            maxFiles: "14d"
        }),
        // ERROR LOGS
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, "../logs/error/error-%DATE%.log"),
            level: "error",
            datePattern: "DD-MM-YYYY",
            maxSize: "20m",
            maxFiles: "14d"
        }),
        // COMBINED LOGS (all levels)
        combinedTransport,
        // CONSOLE OUTPUT
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
    exitOnError: false
});

// 🔹 Handle uncaught exceptions
logger.exceptions.handle(
    new winston.transports.DailyRotateFile({
        filename: path.join(__dirname, "../logs/exception/exception-%DATE%.log"),
        datePattern: "DD-MM-YYYY",
        maxSize: "20m",
        maxFiles: "14d"
    }),
    combinedTransport
);

// 🔹 Handle unhandled promise rejections
logger.rejections.handle(
    new winston.transports.DailyRotateFile({
        filename: path.join(__dirname, "../logs/rejection/rejection-%DATE%.log"),
        datePattern: "DD-MM-YYYY",
        maxSize: "20m",
        maxFiles: "14d"
    }),
    combinedTransport
);

module.exports = logger;