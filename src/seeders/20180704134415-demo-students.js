module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('students', [{
      first_name: 'FirstSeed',
      id_group: '1',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('students', null, {});
  },
};
