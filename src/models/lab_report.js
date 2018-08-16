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
    LabReport.belongsTo(models.Student, { foreignKey: 'studentId', targetKey: 'id' });
    LabReport.belongsTo(models.LabTask, { foreignKey: 'labTaskId', targetKey: 'id' });
    LabReport.hasMany(models.LabComment, { foreignKey: 'labReportId' });
  };
  return LabReport;
};
