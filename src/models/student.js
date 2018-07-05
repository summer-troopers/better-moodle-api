'use strict';

module.exports = function defineStudent(sequelize, DataTypes) {
  const Student = sequelize.define('Student', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: { type: DataTypes.STRING, field: 'first_name' },
    lastName: { type: DataTypes.STRING, field: 'last_name' },
    password: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.INTEGER, field: 'phone_number' },
    email: DataTypes.STRING,
    idGroup: {
      type: DataTypes.INTEGER,
      field: 'id_group',
      foreignKey: true,
    },

  }, {
    tableName: 'students',
    timestamps: false,
  });
  Student.associate = function associateStudent(models) {
    Student.belongsTo(models.Group, { foreignKey: 'idGroup' });
  };
  return Student;
};
