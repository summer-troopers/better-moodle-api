'use strict';

module.exports = function defineCourseTeacher(sequelize, DataTypes) {
  const CourseTeacher = sequelize.define('CourseTeacher', {
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      primaryKey: true,
      foreignKey: true,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      field: 'teacher_id',
      primaryKey: true,
      foreignKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'courses_teachers',
    timestamps: false,
  });
  CourseTeacher.associate = function associateCourseTeacher(models) {
    CourseTeacher.hasMany(models.Course, { foreignKey: 'id', sourceKey: 'courseId' });
    CourseTeacher.hasMany(models.Teacher, { foreignKey: 'id', sourceKey: 'teacherId' });
  };
  return CourseTeacher;
};
