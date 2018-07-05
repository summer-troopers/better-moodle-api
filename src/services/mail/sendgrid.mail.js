'use strict';

const winston = require('winston');
const sgMail = require('@sendgrid/mail');
const config = require('config');
const { createMessage } = require('../../helpers/util');

sgMail.setApiKey(config.sendgridApiKey);

module.exports = {
  send(msg, destMails, callback) {
    const promises = [];
    destMails.forEach((mail) => {
      const message = createMessage(mail, 'server@windows.com', 'Server error',
        msg);
      promises.push(sgMail.send(message));
    });
    Promise.all(promises)
      .then(callback)
      .catch(winston.error);
  },
};
