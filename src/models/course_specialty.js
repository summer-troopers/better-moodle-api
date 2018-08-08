'use strict';

module.exports = function defineCourseSpecialty(sequelize, DataTypes) {
  const CourseSpecialty = sequelize.define('CourseSpecialty', {
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      primaryKey: true,
      foreignKey: true,
      allowNull: false,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      field: 'specialty_id',
      primaryKey: true,
      foreignKey: true,
      allowNull: false,
    },
  }, {
    tableName: 'courses_specialties',
    timestamps: false,
  });
  CourseSpecialty.associate = function associateCourseSpecialty(models) {
    CourseSpecialty.hasMany(models.Course, { foreignKey: 'courseId', targetKey: 'id' });
    CourseSpecialty.hasMany(models.Specialty, { foreignKey: 'specialtyId', targetKey: 'id' });
  };
  return CourseSpecialty;
};
