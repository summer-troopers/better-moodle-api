const bcrypt = require('bcrypt');

module.exports = {
  crypt: bcryptPassword,
  compare: comparePassword,
};
function bcryptPassword(password, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);

    return bcrypt.hash(password, salt, callback);
  });
}

function comparePassword(plainPass, hash, callback) {
  bcrypt.compare(plainPass, hash, (err, isPasswordMatch) => {
    return err == null ? callback(null, isPasswordMatch) : callback(err);
  });
}
