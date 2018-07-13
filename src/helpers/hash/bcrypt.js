const bcrypt = require('bcrypt');
const logger = require('../../services/winston/logger');

function bcryptPassword(password) {
  return bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .catch(logger.error);
}

function comparePassword(plainPass, hash) {
  return bcrypt.compare(plainPass, hash);
}

module.exports = {
  encrypt: bcryptPassword,
  compare: comparePassword,
};
