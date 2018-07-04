module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('specialities', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      field: 'name',
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('specialities'),
};
