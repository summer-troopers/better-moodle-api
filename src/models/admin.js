'use strict';

module.exports = function defineAdmin(sequelize, DataTypes) {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
      validate: {
        is: ['^[\+]?[0]{0,2}?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$', 'i'],
        len: [9, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: 'admins',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Admin.associate = function associateAdmin(models) {
    // associations can be defined here
  };
  return Admin;
};
