'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('task_laboratory', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idTeacher: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'id_teacher',
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      idCourse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'id_course',
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      idLaboratoryTaskMoongo: {
        type: Sequelize.INTEGER,
        field: 'id_laboratory_task_mongo',
        allowNull: false,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.dropTable('task_laboratory'); },
};
