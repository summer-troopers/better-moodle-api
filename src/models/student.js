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
        is: ['^[\+]?[0]{0,2}?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$', 'i'],
        len: [9, 20],
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
    underscored: true,
  });
  Student.associate = function associateStudent(models) {
    Student.belongsTo(models.Group, { foreignKey: 'groupId', targetKey: 'id' });
    Student.hasMany(models.LabReport, { foreignKey: 'studentId', sourceKey: 'id' });
  };
  return Student;
};
