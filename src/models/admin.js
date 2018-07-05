'use strict';

module.exports = function defineAdmin(sequelize, DataTypes) {
  const Admin = sequelize.define('Admin', {
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
    tableName: 'admins',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Admin.associate = function associateAdmin(models) {
    // associations can be defined here
  };
  return Admin;
};
