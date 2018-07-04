
module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define('Group', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: { type: DataTypes.STRING },
    idSpecialities: {
      type: DataTypes.INTEGER,
      field: 'id_speciality',
      foreignKey: true,
    },

  }, {
    tableName: 'groups',
    timestamps: false,
  });
  Groups.associate = (models) => {
    Groups.hasMany(models.Student, { foreignKey: 'idGroup' });
    Groups.belongsTo(models.Speciality, { foreignKey: 'idSpecialities' });
  };
  return Groups;
};
