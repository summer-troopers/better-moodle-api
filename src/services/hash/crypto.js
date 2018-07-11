const crypto = require('crypto');

function cryptoPassword(password, callback) {
  return crypto.pbkdf2(password, 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    return callback(derivedKey.toString('hex'));
  });
}
function comparePassword(password, hash) {
  const newHash = crypto.pbkdf2(password, 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
    if (err) return callback(err);
    return derivedKey.toString('hex');
  });
  if (newHash === hash) return true;
  return false;
}

module.exports = {
  crypt: cryptoPassword,
  compare: comparePassword,
};
