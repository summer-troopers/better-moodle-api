'use strict';

module.exports = function defineCourse(sequelize, DataTypes) {
  const Course = sequelize.define('Course', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 50],
      },
      allowNull: false,
    },
  }, {
    tableName: 'courses',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Course.associate = function associateCourse(models) {
    Course.belongsToMany(models.Teacher, { through: 'CourseTeacher', foreignKey: 'idTeacher' });
  };
  return Course;
};
