const winston = require('winston');
const { combine, colorize, printf } = winston.format;
require('express-async-errors');

const myFormat = printf(({ level, message, timestamp }) => {
  return `${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(colorize(), myFormat),
  transports: [new winston.transports.Console()],
  rejectionHandlers: [
    new winston.transports.File({ filename: './loggerMessages/rejections.log' }),
    new winston.transports.Console(),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './loggerMessages/exceptions.log' }),
    new winston.transports.Console(),
  ],
});

module.exports = logger;
