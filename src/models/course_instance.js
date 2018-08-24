'use strict';

module.exports = function defineLab(sequelize, DataTypes) {
  const CourseInstance = sequelize.define(
    'CourseInstance',
    {
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
      labTasksFileId: {
        type: DataTypes.STRING,
        field: 'lab_tasks_file_id',
        allowNull: true,
      },
    },
    {
      tableName: 'course_instances',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  CourseInstance.associate = function associateLab(models) {
    CourseInstance.belongsToMany(models.Specialty, {
      through: 'CourseInstanceSpecialty',
      foreignKey: 'courseInstanceId',
    });
    CourseInstance.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    CourseInstance.belongsTo(models.Course, { foreignKey: 'courseId' });
    CourseInstance.hasMany(models.LabReport, { foreignKey: 'courseInstanceId' });
  };

  return CourseInstance;
};
