const config = require('config');
const ownHash = require('./own-hash');
const bcryptModule = require('./bcrypt');
const cryptoModule = require('./crypto');

module.exports = function getHashModule() {
  switch (config.hashModule) {
    case 'OWN_HASH':
      return ownHash;
    case 'CRYPTO':
      return cryptoModule;
    case 'BCRYPT':
      return bcryptModule;
    default:
      throw new Error('No hash specified.');
  }
};
