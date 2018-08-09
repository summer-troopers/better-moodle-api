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
  CourseTeacher.associate = function associateCourseTeacher(models) {
    // CourseTeacher.belongsTo(models.Course, { foreignKey: 'courseId' });
    // CourseTeacher.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
  };
  return CourseTeacher;
};
