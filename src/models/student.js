'use strict';

module.exports = function defineStudent(sequelize, DataTypes) {
  const Student = sequelize.define('Student', {
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
        is: ['^0\s?[67]\d{1}\s?\d{3}\s?\d{3}$', 'i'], // examples: ['0 61 371 625', '067843961']
      },
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      field: 'group_id',
      allowNull: false,
    },
  },
  {
    tableName: 'students',
    timestamps: true,
  });
  Student.associate = function associateStudent(models) {
    Student.belongsTo(models.Group, { foreignKey: 'groupId', targetKey: 'id' });
    Student.hasMany(models.LabReport, { foreignKey: 'studentId', sourceKey: 'id' });
  };
  return Student;
};
