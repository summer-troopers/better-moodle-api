'use strict';

module.exports = function defineGroup(sequelize, DataTypes) {
  const Group = sequelize.define(
    'Group',
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
        validate: {
          len: [1, 50],
        },
      },
      specialtyId: {
        type: DataTypes.INTEGER,
        field: 'specialty_id',
        allowNull: false,
      },
    },
    {
      tableName: 'groups',
      timestamps: true,
    },
  );

  Group.associate = function associateGroup(models) {
    Group.hasMany(models.Student, { foreignKey: 'groupId' });
    Group.belongsTo(models.Specialty, { foreignKey: 'specialtyId' });
  };

  return Group;
};
