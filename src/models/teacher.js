
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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
  Teacher.associate = (models) => {
    // associations can be defined here
  };
  return Teacher;
};
