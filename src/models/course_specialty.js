'use strict';

module.exports = function defineCourseSpecialty(sequelize, DataTypes) {
  const CourseSpecialty = sequelize.define('CourseSpecialty', {
    courseId: {
      type: DataTypes.INTEGER,
      field: 'course_id',
      primaryKey: true,
      allowNull: false,
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      field: 'specialty_id',
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: 'courses_specialties',
    timestamps: false,
  });
  CourseSpecialty.associate = function associateCourseSpecialty(models) {
    // CourseSpecialty.belongsTo(models.Course, { foreignKey: 'courseId' });
    // CourseSpecialty.belongsTo(models.Specialty, { foreignKey: 'specialtyId' });
  };
  return CourseSpecialty;
};
