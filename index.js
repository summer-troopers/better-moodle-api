'use strict';

const http = require('http');
const config = require('config');
const createConnection = require('./src/services/connectors/connector-factory');
const logger = require('./src/services/winston/logger');

createConnection()
  .connect()
  .then((connection) => {
    const app = require('./src/app')(connection); // eslint-disable-line global-require

    const server = http.Server(app);
    const io = require('socket.io')(server);

    const { port, host } = config;

    server.listen(port, host, () => {
      logger.info(`Server started on: ${port}, host: ${host}`);
    });
  })
  .catch(console.error);
