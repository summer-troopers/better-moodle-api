'use strict';

const winston = require('winston');
const config = require('config');
const sendGridMail = require('../mail/sendgrid.mail');


module.exports = class SendGridTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.name = 'SendGridLogger';
    this.mailServer = sendGridMail;
    this.destMails = (options && options.destMails)
      || config.errorEmails.split(';');
  }


  log(level, msg, meta, callback) {
    this.mailServer.send(msg, this.destMails, callback);
  }
};
