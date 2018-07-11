'use strict';

module.exports = function defineSpecialty(sequelize, DataTypes) {
  const Specialty = sequelize.define('Specialty', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false,
    },
  }, {
    tableName: 'specialties',
    timestamps: false,
  });
  Specialty.associate = function associateSpecialty(models) {
    Specialty.hasMany(models.Group, {
      foreignKey: 'id',
    });
  };
  return Specialty;
};
