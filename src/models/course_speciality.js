'use strict';

module.exports = function defineCourseSpeciality(sequelize, DataTypes) {
  const CourseSpeciality = sequelize.define('CourseSpeciality', {
    idSpeciality: {
      type: DataTypes.INTEGER,
      field: 'id_speciality',
      foreignKey: true,
    },
    idCourse: {
      type: DataTypes.INTEGER,
      field: 'id_course',
      foreignKey: true,
    },

  }, {
    tableName: 'courses_specialities',
    timestamps: false,
  });
  CourseSpeciality.associate = function associateCourseSpeciality(models) {
    CourseSpeciality.hasMany(models.Speciality, {
      foreignKey: 'id',
    });
    CourseSpeciality.hasMany(models.Course, {
      foreignKey: 'id',
    });
  };
  return CourseSpeciality;
};
