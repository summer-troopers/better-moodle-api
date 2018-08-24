'use strict';

module.exports = function defineCourseSpecialty(sequelize, DataTypes) {
  const CourseInstanceSpecialty = sequelize.define(
    'CourseInstanceSpecialty',
    {
      courseInstanceId: {
        type: DataTypes.INTEGER,
        field: 'course_instance_id',
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
      tableName: 'course_instances-specialties',
      timestamps: true,
    },
  );

  // eslint-disable-next-line no-unused-vars
  CourseInstanceSpecialty.associate = function associateCourseInstanceSpecialty(models) {};

  return CourseInstanceSpecialty;
};
