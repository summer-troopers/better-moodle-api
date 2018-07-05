'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('students', [{
      first_name: 'FirstSeed',
      id_group: '1',
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('students', null, {}); },
};
