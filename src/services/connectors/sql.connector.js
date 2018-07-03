const Sequelize = require('sequelize');

module.exports = (uri) => {
  return {
    connect,
  };

  async function connect() {
    const sequelize = new Sequelize(uri, {
      dialect: 'mysql',
      logging: false,
      define: {
        charset: 'utf8mb4',
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    return sequelize;
  }
};
