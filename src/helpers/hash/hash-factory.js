const config = require('config');
const bcryptModule = require('./bcrypt');
const cryptoModule = require('./crypto');

module.exports = function getHashModule() {
  switch (config.hashModule) {
    case 'CRYPTO':
      return cryptoModule;
    case 'BCRYPT':
      return bcryptModule;
    default:
      throw new Error('No hash specified.');
  }
};
