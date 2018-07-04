module.exports = (sequelize, DataTypes) => {
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
  Admin.associate = (models) => {
    // associations can be defined here
  };
  return Admin;
};
