module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('courses_specialities', [{
      id_speciality: '1',
      id_course: '1',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('courses_specialities', null, {});
  },
};
