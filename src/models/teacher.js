'use strict';

module.exports = function defineTeacher(sequelize, DataTypes) {
  const Teacher = sequelize.define('Teacher', {
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
  },
  {
    tableName: 'teachers',
    timestamps: true,
  });
  // eslint-disable-next-line no-unused-vars
  Teacher.associate = function associateTeacher(models) {
    Teacher.belongsToMany(models.Course, {
      through: 'CourseTeacher',
      foreignKey: 'teacherId',
    });
    Teacher.hasMany(models.LabTask, { foreignKey: 'teacherId', sourceKey: 'id' });
  };
  return Teacher;
};
