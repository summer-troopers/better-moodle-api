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
    content: {
      type: DataTypes.STRING,
      field: 'content',
      allowNull: false,
    },
    mark: {
      type: DataTypes.INTEGER,
      field: 'mark',
      allowNull: false,
      validate: {
        min: 4,
        max: 10,
      },
    },
  },
  {
    tableName: 'lab_comments',
    timestamps: true,
  });
  // eslint-disable-next-line no-unused-vars
  LabComment.associate = function associateLabComment(models) {
    LabComment.belongsTo(models.LabReport, { foreignKey: 'labReportId' });
  };
  return LabComment;
};
