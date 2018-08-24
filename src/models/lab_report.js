'use strict';

module.exports = function defineLabReport(sequelize, DataTypes) {
  const LabReport = sequelize.define(
    'LabReport',
    {
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
      courseInstanceId: {
        type: DataTypes.INTEGER,
        field: 'course_instance_id',
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
      labReportFileId: {
        type: DataTypes.STRING,
        field: 'lab_report_file_id',
        allowNull: false,
      },
    },
    {
      tableName: 'lab_reports',
      timestamps: true,
    },
  );

  LabReport.associate = function associateLabReport(models) {
    LabReport.belongsTo(models.Student, { foreignKey: 'studentId' });
    LabReport.belongsTo(models.CourseInstance, { foreignKey: 'courseInstanceId' });
  };

  return LabReport;
};
