'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('groups', [{
      name: 'FirstSeed',
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('groups', null, {}); },
};
