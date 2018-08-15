'use strict';

module.exports = function defineLabComments(sequelize, DataTypes) {
  const LabComment = sequelize.define('LabComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    labReportId: {
      type: DataTypes.INTEGER,
      field: 'lab_report_id',
      allowNull: false,
    },
    teacherComment: {
      type: DataTypes.STRING,
      field: 'teacher_comment',
      allowNull: false,
    },
    studentComment: {
      type: DataTypes.STRING,
      field: 'student_comment',
      allowNull: false,
    },
  },
    {
      tableName: 'lab_comments',
      timestamps: false,
    });
  // eslint-disable-next-line no-unused-vars
  LabComment.associate = function associateLabComment(models) {
    LabComment.belongsTo(models.LabReport, { foreignKey: 'labReportId' });
  };
  return LabComment;
};
