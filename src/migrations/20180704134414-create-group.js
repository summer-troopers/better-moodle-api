'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('groups', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        field: 'specialty_id',
        foreignKey: true,
        allowNull: false,
        references: {
          model: 'specialties',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('groups'); },
};
