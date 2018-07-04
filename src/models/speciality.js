
module.exports = (sequelize, DataTypes) => {
  const Specialities = sequelize.define('Speciality', {
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
  Specialities.associate = (models) => {
    Specialities.hasMany(models.Group, {
      foreignKey: 'idSpecialities',
    });
  };
  return Specialities;
};
