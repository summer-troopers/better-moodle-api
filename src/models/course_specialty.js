'use strict';

module.exports = function defineCourseSpecialty(sequelize, DataTypes) {
  const CourseSpecialty = sequelize.define('CourseSpecialty', {
    idSpecialty: {
      type: DataTypes.INTEGER,
      field: 'id_specialty',
      foreignKey: true,
      allowNull: false,
    },
    idCourse: {
      type: DataTypes.INTEGER,
      field: 'id_course',
      foreignKey: true,
      allowNull: false,
    },

  }, {
    tableName: 'courses_specialties',
    timestamps: false,
  });
  CourseSpecialty.associate = function associateCourseSpecialty(models) {
    CourseSpecialty.hasMany(models.Specialty, {
      foreignKey: 'id',
    });
    CourseSpecialty.hasMany(models.Course, {
      foreignKey: 'id',
    });
  };
  return CourseSpecialty;
};
