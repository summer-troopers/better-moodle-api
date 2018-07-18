'use strict';

const http = require('http');
const config = require('config');
const createConnection = require('./src/services/connectors/connector-factory');
const logger = require('./src/services/winston/logger');
const importModels = require('./src/models/import');

createConnection()
  .connect()
  .then((connection) => {
    importModels(connection);

    const app = require('./src/app')(connection); // eslint-disable-line global-require

    const server = http.Server(app);
    const io = require('socket.io')(server);

    require('./src/services/chat-io/chat-connection')(io, connection);

    const { port, host } = config;

    server.listen(port, host, () => {
      logger.info(`Server started on: ${port}, host: ${host}`);
    });
  })
  .catch(console.error);
