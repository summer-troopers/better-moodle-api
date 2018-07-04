module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('groups', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    idSpecialities: {
      type: Sequelize.INTEGER,
      field: 'id_speciality',
      references: {
        model: 'specialities',
        key: 'id',
      },
    },

  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('groups'),
};
