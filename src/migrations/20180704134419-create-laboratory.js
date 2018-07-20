'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('laboratory', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idStudent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'id_student',
        references: {
          model: 'students',
          key: 'id',
        },
      },
      idLaboratoryTask: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'id_laboratory_task',
        references: {
          model: 'task_laboratory',
          key: 'id',
        },
      },
      idLaboratoryMoongo: {
        type: Sequelize.INTEGER,
        field: 'id_laboratory_moongo',
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('laboratory'); },
};
