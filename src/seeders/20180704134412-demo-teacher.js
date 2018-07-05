'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('teachers', [{
      first_name: 'FirstSeedname',
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('teachers', null, {}); },
};
