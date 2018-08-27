'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('lab_reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: Sequelize.INTEGER,
        field: 'student_id',
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'students',
          key: 'id',
        },
      },
      courseInstanceId: {
        type: Sequelize.INTEGER,
        field: 'course_instance_id',
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'course_instances',
          key: 'id',
        },
      },
      labReportFileId: {
        type: Sequelize.STRING,
        field: 'lab_report_file_id',
        allowNull: false,
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      mark: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('lab_reports');
  },
};
