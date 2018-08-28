'use strict';

module.exports = function defineCourseSpecialty(sequelize, DataTypes) {
  const CourseInstanceSpecialty = sequelize.define(
    'CourseInstanceSpecialty',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      courseInstanceId: {
        type: DataTypes.INTEGER,
        field: 'course_instance_id',
        allowNull: false,
      },
      specialtyId: {
        type: DataTypes.INTEGER,
        field: 'specialty_id',
        allowNull: false,
      },
    },
    {
      tableName: 'course_instances-specialties',
      timestamps: true,
    },
  );

  CourseInstanceSpecialty.associate = function associateCourseInstanceSpecialty(models) {
    CourseInstanceSpecialty.belongsTo(models.CourseInstance, { foreignKey: 'courseInstanceId' });
    CourseInstanceSpecialty.belongsTo(models.Specialty, { foreignKey: 'specialtyId' });
  };

  return CourseInstanceSpecialty;
};
