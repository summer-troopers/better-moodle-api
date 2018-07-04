module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('admins', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name',
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name',
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.INTEGER,
      field: 'phone_number',
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('admins'),
};
