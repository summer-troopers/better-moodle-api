'use strict';

module.exports = function defineLab(sequelize, DataTypes) {
  const Lab = sequelize.define('Lab', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      field: 'teacher_id',
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      allowNull: false,
    },
    mongoFileId: {
      type: DataTypes.STRING,
      field: 'mongo_file_id',
      allowNull: true,
    },
  },
  {
    tableName: 'labs',
    timestamps: true,
  });
  // eslint-disable-next-line no-unused-vars
  Lab.associate = function associateLab(models) {
    Lab.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    Lab.belongsTo(models.Course, { foreignKey: 'courseId' });
    Lab.hasMany(models.LabReport, { foreignKey: 'labId' });
  };
  return Lab;
};
