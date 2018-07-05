'use strict';

module.exports = function defineTeacher(sequelize, DataTypes) {
  const Teacher = sequelize.define('Teacher', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    },
    password: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      field: 'phone_number',
    },
    email: DataTypes.STRING,
  }, {
    tableName: 'teachers',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Teacher.associate = function associateTeacher(models) {
    // associations can be defined here
  };
  return Teacher;
};
