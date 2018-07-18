const crypto = require('crypto');
const util = require('util');
const config = require('../../../config/default');
const logger = require('../../services/winston/logger');

const encrypt = util.promisify(crypto.pbkdf2);

async function cryptoPassword(password) {
  let hash;
  try {
    hash = await encrypt(password, config.salt, 100000, 64, 'sha512');
  } catch (error) {
    logger.error(error);
  }
  return hash.toString('hex');
}

async function comparePassword(password, hash) {
  const newHash = await encrypt(password, config.salt, 100000, 64, 'sha512');
  if (newHash.toString('hex') === hash.toString('hex')) return true;
  return false;
}

module.exports = {
  encrypt: cryptoPassword,
  compare: comparePassword,
};
