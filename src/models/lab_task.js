'use strict';

module.exports = function defineLabTask(sequelize, DataTypes) {
  const LabTask = sequelize.define('LabTask', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      field: 'teacher_id',
      foreignKey: true,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      foreignKey: true,
      allowNull: false,
    },
    mongoFileId: {
      type: DataTypes.STRING,
      field: 'mongo_file_id',
      allowNull: false,
    },
  }, {
    tableName: 'lab_tasks',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  LabTask.associate = function associateLabTask(models) {
    LabTask.belongsTo(models.Teacher, { foreignKey: 'teacherId', targetKey: 'id' });
    LabTask.belongsTo(models.Course, { foreignKey: 'courseId', targetKey: 'id' });
    LabTask.hasMany(models.LabReport, { foreignKey: 'labTaskId', sourceKey: 'id' });
  };
  return TaskLaboratory;
};
