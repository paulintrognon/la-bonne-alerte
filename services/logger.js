'use strict';

const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './log/app.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
