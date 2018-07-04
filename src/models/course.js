
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,
    },

  }, {
    tableName: 'courses',
    timestamps: false,
  });
  Course.associate = (models) => {
    // associations can be defined here
  };
  return Course;
};
