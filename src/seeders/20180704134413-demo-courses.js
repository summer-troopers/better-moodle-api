module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('courses', [{
      name: 'FirstSeed',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('courses', null, {});
  },
};
