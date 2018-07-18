'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('chat_users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idUser: {
        type: Sequelize.STRING,
        field: 'id_user',
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        field: 'time',
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('chatUsers'); },
};
