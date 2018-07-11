const config = require('config');
const createConnection = require('./src//services/connectors/connector-factory');
const logger = require('./src/services/winston/logger');

createConnection()
  .connect()
  .then((connection) => {
    const app = require('./src/app')(connection); // eslint-disable-line global-require

    const { port, host } = config;

    app.listen(port, host, () => {
      logger.info(`Server started on: ${port}, host: ${host}`);
    });
  })
  .catch(logger.error);
