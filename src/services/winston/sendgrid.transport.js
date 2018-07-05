'use strict';

const winston = require('winston');
const SendGridMail = require('../mail/sendgrid.mail');

module.exports = class SendGridTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.name = 'SendGridLogger';
    this.level = (options && options.level) || 'error';
    this.mailServer = new SendGridMail(options);
  }

  log(level, msg, meta, callback) {
    this.mailServer.send(msg, callback);
  }
};
