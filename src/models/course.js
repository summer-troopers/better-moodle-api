'use strict';

module.exports = function defineCourse(sequelize, DataTypes) {
  const Course = sequelize.define(
    'Course',
    {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'courses',
      timestamps: true,
    },
  );

  Course.associate = function associateCourse(models) {
    Course.belongsToMany(models.Teacher, {
      through: 'CourseInstance',
      foreignKey: 'courseId',
    });
    Course.hasMany(models.CourseInstance, { foreignKey: 'courseId' });
  };

  return Course;
};
