'use strict';

module.exports = function defineCourseTeacher(sequelize, DataTypes) {
  const CourseTeacher = sequelize.define('CourseTeacher', {
    idCourse: {
      type: DataTypes.INTEGER,
      field: 'id_course',
      foreignKey: true,
      allowNull: false,
    },
    idTeacher: {
      type: DataTypes.INTEGER,
      field: 'id_teacher',
      foreignKey: true,
      allowNull: false,
    },

  }, {
    tableName: 'courses_teachers',
    timestamps: false,
  });
  CourseTeacher.associate = function associateCourseTeacher(models) {
    CourseTeacher.hasMany(models.Teacher, { foreignKey: 'id' });
    CourseTeacher.hasMany(models.Course, { foreignKey: 'id' });
  };
  return CourseTeacher;
};
