'use strict';

module.exports = function defineCourseSpeciality(sequelize, DataTypes) {
  const CourseSpeciality = sequelize.define('CourseSpeciality', {
    name: {
      type: DataTypes.STRING,
    },
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
      foreignKey: 'idSpeciality',
    });
    CourseSpeciality.hasMany(models.Course, {
      foreignKey: 'idCourse',
    });
  };
  return CourseSpeciality;
};
