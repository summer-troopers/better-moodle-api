module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('admins', [{
      first_name: 'FirstSeed',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('admins', null, {});
  },
};
