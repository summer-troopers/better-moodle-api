'use strict';

module.exports = function defineCourse(sequelize, DataTypes) {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
  }, {
    tableName: 'courses',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Course.associate = function associateCourse(models) {
    Course.belongsToMany(models.Teacher, { through: 'CourseTeacher', foreignKey: 'courseId', otherKey: 'theacherId' });
    Course.belongsToMany(models.Specialty, { through: 'CourseSpecialty', foreignKey: 'courseId', otherKey: 'specialtyId' });
    Course.hasMany(models.LabTask, { foreignKey: 'courseId', sourceKey: 'id' });
  };
  return Course;
};
