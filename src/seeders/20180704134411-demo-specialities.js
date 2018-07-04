module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('specialities', [{
      name: 'FirstSeedSpec',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('specialities', null, {});
  },
};
