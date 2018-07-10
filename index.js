const config = require('config');
const createConnection = require('./src//services/connectors/connector.factory');
const winston = require('./src/services/winston/winston');

createConnection()
  .connect()
  .then((connection) => {
    const app = require('./src/app')(connection); // eslint-disable-line global-require

    const { port, host } = config;

    app.listen(port, host, () => {
      winston.info(`Server started on: ${port}, host: ${host}`);
    });
  })
  .catch(winston.error);
