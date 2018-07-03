const appRoot = require('app-root-path');
const winston = require('winston');
const config = require('config');
const SendGridTransport = require('./sendgrid.transport');

const opt = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  sendgrid: {
    level: 'info',
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(opt.file),
    new winston.transports.Console(opt.console),
    new SendGridTransport(opt.sendgrid),
  ],
  exitOnError: false,
});

logger.stream = {
  write(message, encoding) {
    logger.log('info', message);
  },
};

module.exports = logger;
