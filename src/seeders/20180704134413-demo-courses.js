'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('courses', [{
      name: 'FirstSeed',
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses', null, {}); },
};
