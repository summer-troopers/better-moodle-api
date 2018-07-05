'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('specialities', generate50Specialities(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('specialities', null, {}); },
};

function generate50Specialities() {
  const specialities = [];
  for (let i = 1; i <= 50; i += 1) {
    specialities.push({
      name: faker.name.jobDescriptor(),
    });
  }
  return specialities;
}
