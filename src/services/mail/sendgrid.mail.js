'use strict';

const sgMail = require('@sendgrid/mail');
const config = require('config');

module.exports = class SendGridMail {
  constructor(options) {
    this.mailServer = sgMail;
    this.mailServer.setApiKey(config.sendgridApiKey);
    this.destMails = (options && options.destMails) || config.errorEmails;
  }

  send(msg, callback) {
    this.destMails.forEach((mail) => {
      const message = {
        to: mail,
        from: 'server@windows.com',
        subject: 'Server Error',
        text: 'You have an error',
      };
      this.mailServer.send(message, callback);
    });
  }
};
