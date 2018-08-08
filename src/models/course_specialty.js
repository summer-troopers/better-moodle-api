'use strict';

module.exports = function defineCourseSpecialty(sequelize, DataTypes) {
  const CourseSpecialty = sequelize.define('CourseSpecialty', {
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      primaryKey: true,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      field: 'specialty_id',
      primaryKey: true,
      foreignKey: true,
      allowNull: false,
      references: {
        model: 'specialties',
        key: 'id',
      },
    },
  },
  {
    tableName: 'courses_specialties',
    timestamps: false,
  });
  CourseSpecialty.associate = function associateCourseSpecialty(models) {
    CourseSpecialty.hasMany(models.Course, { foreignKey: 'id', sourceKey: 'courseId' });
    CourseSpecialty.hasMany(models.Specialty, { foreignKey: 'id', sourceKey: 'specialtyId' });
  };
  return CourseSpecialty;
};
