const config = require('config');
const connFactory = require('./src//services/connectors/connector.factory');

connFactory()
  .connect()
  .then((connection) => {
    const app = require('./src/app')(connection);

    const { port } = config;

    app.listen(port, () => {
      console.log(`Server started on: ${port}`);
    });
  })
  .catch(console.error);
