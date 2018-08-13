'use strict';

module.exports = function defineCourseTeacher(sequelize, DataTypes) {
  const CourseTeacher = sequelize.define('CourseTeacher', {
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      primaryKey: true,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      field: 'teacher_id',
      primaryKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'courses_teachers',
    timestamps: false,
  });
  CourseTeacher.associate = function associateCourseTeacher(models) { };
  return CourseTeacher;
};
