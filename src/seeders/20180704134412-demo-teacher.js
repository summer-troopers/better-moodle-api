
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('teachers', [{
      first_name: 'FirstSeedname',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('teachers', null, {});
  },
};
