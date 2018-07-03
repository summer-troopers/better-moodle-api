const config = require('config');

module.exports = () => require('./sql.connector')(config.mysql);
