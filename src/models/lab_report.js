'use strict';

module.exports = function defineLabReport(sequelize, DataTypes) {
  const LabReport = sequelize.define('LabReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      field: 'student_id',
      allowNull: false,
    },
    labTaskId: {
      type: DataTypes.INTEGER,
      field: 'lab_task_id',
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mark: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10,
      },
    },
    mongoFileId: {
      type: DataTypes.STRING,
      field: 'mongo_file_id',
      allowNull: false,
    },
  }, {
    tableName: 'lab_reports',
    timestamps: true,
  });
  // eslint-disable-next-line no-unused-vars
  LabReport.associate = function associateLabReport(models) {
    LabReport.belongsTo(models.Student, { foreignKey: 'studentId' });
    LabReport.belongsTo(models.LabTask, { foreignKey: 'labTaskId' });
  };
  return LabReport;
};
