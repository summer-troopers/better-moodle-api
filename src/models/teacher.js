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
        is: ['^[\+]?[0]{0,2}?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$', 'i'],
        len: [9, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: 'teachers',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Teacher.associate = function associateTeacher(models) {
    Teacher.belongsToMany(models.Course, { through: 'CourseTeacher', foreignKey: 'teacherId', otherKey: 'courseId' });
    Teacher.hasMany(models.LabTask, { foreignKey: 'teacherId', sourceKey: 'id' });
  };
  return Teacher;
};
