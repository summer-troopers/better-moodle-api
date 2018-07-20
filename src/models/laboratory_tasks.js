'use strict';

module.exports = function defineAdmin(sequelize, DataTypes) {
  const TaskLaboratory = sequelize.define('TaskLaboratory', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    idTeacher: {
      type: DataTypes.INTEGER,
      field: 'id_teacher',
      allowNull: false,
    },
    idCourse: {
      type: DataTypes.INTEGER,
      field: 'id_course',
      allowNull: false,
    },
    idLaboratoryTaskMoongo: {
      type: DataTypes.INTEGER,
      field: 'id_laboratory_task_mongo',
      allowNull: false,
    },
  }, {
    tableName: 'task_laboratory',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  TaskLaboratory.associate = function associateTaskLaboratory(models) {
    TaskLaboratory.hasMany(models.Teacher, { foreignKey: 'id' });
    TaskLaboratory.hasMany(models.Course, { foreignKey: 'id' });
    TaskLaboratory.belongsTo(models.Laboratory, { foreignKey: 'id' });
  };
  return TaskLaboratory;
};
