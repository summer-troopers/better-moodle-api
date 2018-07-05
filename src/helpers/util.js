'use strict';

function createMessage(to, from, subject, text) {
  const message = {
    to,
    from,
    subject,
    text,
  };
  return message;
}

module.exports = {
  createMessage,
};
