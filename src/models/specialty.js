'use strict';

module.exports = function defineSpecialty(sequelize, DataTypes) {
  const Specialty = sequelize.define('Specialty', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'specialties',
    timestamps: true,
    underscored: true,
  });

  Specialty.associate = function associateSpecialty(models) {
    Specialty.belongsToMany(models.Course, {
      through: 'CourseSpecialty',
      foreignKey: 'specialtyId',
    });
    Specialty.hasMany(models.Group, { foreignKey: 'specialtyId', sourceKey: 'id' });
  };
  return Specialty;
};
