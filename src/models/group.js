'use strict';

module.exports = function defineGroup(sequelize, DataTypes) {
  const Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idSpecialty: {
      type: DataTypes.INTEGER,
      field: 'id_specialty',
      allowNull: false,
      foreignKey: true,
    },

  }, {
    tableName: 'groups',
    timestamps: false,
  });
  Group.associate = function associateGroup(models) {
    Group.hasMany(models.Student, { foreignKey: 'id' });
    Group.belongsTo(models.Specialty, { foreignKey: 'id' });
  };
  return Group;
};
