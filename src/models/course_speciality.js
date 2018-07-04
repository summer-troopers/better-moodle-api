module.exports = (sequelize, DataTypes) => {
  const CourseSpeciality = sequelize.define('CourseSpeciality', {
    name: {
      type: DataTypes.STRING,
    },
    idSpecialities: {
      type: DataTypes.INTEGER,
      field: 'id_speciality',
      foreignKey: true,
    },
    idCourse: {
      type: DataTypes.INTEGER,
      field: 'id_course',
      foreignKey: true,
    },

  }, {
    tableName: 'courses_specialities',
    timestamps: false,
  });
  CourseSpeciality.associate = (models) => {
    CourseSpeciality.hasMany(models.Speciality, {
      foreignKey: 'idSpecialities',
    });
    CourseSpeciality.hasMany(models.Course, {
      foreignKey: 'idCourse',
    });
  };
  return CourseSpeciality;
};
