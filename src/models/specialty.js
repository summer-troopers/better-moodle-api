'use strict';

module.exports = function defineSpecialty(sequelize, DataTypes) {
  const Specialty = sequelize.define(
    'Specialty',
    {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'specialties',
      timestamps: true,
    },
  );

  Specialty.associate = function associateSpecialty(models) {
    Specialty.belongsToMany(models.CourseInstance, {
      through: 'CourseInstanceSpecialty',
      foreignKey: 'specialtyId',
    });
    Specialty.hasMany(models.Group, { foreignKey: 'specialtyId' });
  };

  return Specialty;
};
