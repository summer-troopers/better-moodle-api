'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('specialties', generate50Specialties(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('specialties', null, {}); },
};

function generate50Specialties() {
  const specialties = [];
  for (let i = 1; i <= 50; i += 1) {
    specialties.push({
      name: faker.name.jobDescriptor(),
    });
  }
  return specialties;
}
