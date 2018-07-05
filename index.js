const config = require('config');
const connFactory = require('./src//services/connectors/connector.factory');
const winston = require('./src/services/winston/winston');

connFactory()
  .connect()
  .then((connection) => {
    const app = require('./src/app')(connection); // eslint-disable-line global-require

    const { port } = config;

    app.listen(port, () => {
      winston.info(`Server started on: ${port}`);
    });
  })
  .catch(winston.error);
