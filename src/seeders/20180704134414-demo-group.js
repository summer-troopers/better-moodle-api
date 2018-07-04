module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('groups', [{
      name: 'FirstSeed',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('groups', null, {});
  },
};
