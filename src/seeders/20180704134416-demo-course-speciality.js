'use strict';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('courses_specialities', [{
      id_speciality: '1',
      id_course: '1',
    }], {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses_specialities', null, {}); },
};
