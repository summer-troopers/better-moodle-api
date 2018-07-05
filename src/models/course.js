'use strict';

module.exports = function defineCourse(sequelize, DataTypes) {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,
    },

  }, {
    tableName: 'courses',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Course.associate = function associateCourse(models) {
    // associations can be defined here
  };
  return Course;
};
