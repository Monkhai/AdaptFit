const winston = require('winston');
require('express-async-errors');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple({ all: true })
  ),
  transports: [new winston.transports.Console({ filename: 'combined.log' })],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
    new winston.transports.Console(),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
