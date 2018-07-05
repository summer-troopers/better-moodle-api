'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('teachers', generate50Teachers(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('teachers', null, {}); },
};

function generate50Teachers() {
  const teachers = [];
  for (let i = 1; i <= 50; i += 1) {
    teachers.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8, 16),
      phone_number: faker.phone.phoneNumberFormat(0),
    });
  }
  return teachers;
}
