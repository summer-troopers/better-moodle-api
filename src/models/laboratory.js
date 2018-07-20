'use strict';

module.exports = function defineAdmin(sequelize, DataTypes) {
  const Laboratory = sequelize.define('Laboratory', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    idStudent: {
      type: DataTypes.INTEGER,
      field: 'id_student',
      allowNull: false,
    },
    idLaboratoryTask: {
      type: DataTypes.INTEGER,
      field: 'id_laboratory_task',
      allowNull: false,
    },
    idLaboratoryMoongo: {
      type: DataTypes.INTEGER,
      field: 'id_laboratory_mongo',
      allowNull: false,
    },
  }, {
    tableName: 'laboratory',
    timestamps: false,
  });
  // eslint-disable-next-line no-unused-vars
  Laboratory.associate = function associateLaboratory(models) {
    Laboratory.hasMany(models.Student, { foreignKey: 'id' });
    Laboratory.hasMany(models.TaskLaboratory, { foreignKey: 'id' });
  };
  return Laboratory;
};
