'use strict';

module.exports = function defineSpeciality(sequelize, DataTypes) {
  const Speciality = sequelize.define('Speciality', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
    },
  }, {
    tableName: 'specialities',
    timestamps: false,
  });
  Speciality.associate = function associateSpeciality(models) {
    Speciality.hasMany(models.Group, {
      foreignKey: 'id',
    });
  };
  return Speciality;
};
