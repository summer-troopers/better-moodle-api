'use strict';

module.exports = function defineGroup(sequelize, DataTypes) {
  const Group = sequelize.define('Group', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: { type: DataTypes.STRING },
    idSpeciality: {
      type: DataTypes.INTEGER,
      field: 'id_speciality',
      foreignKey: true,
    },

  }, {
    tableName: 'groups',
    timestamps: false,
  });
  Group.associate = function associateGroup(models) {
    Group.hasMany(models.Student, { foreignKey: 'idGroup' });
    Group.belongsTo(models.Speciality, { foreignKey: 'idSpeciality' });
  };
  return Group;
};
