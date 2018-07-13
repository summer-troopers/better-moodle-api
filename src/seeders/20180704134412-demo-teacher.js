'use strict';

const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();


module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) { return queryInterface.bulkInsert('teachers', generate50Teachers(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('teachers', null, {}); },
};

async function generate50Teachers() {
  const teachers = [];
  teachers.push({
    first_name: 'teacher',
    last_name: 'teacher',
    email: 'teacher@email.com',
    password: await hashFactory.encrypt('teacher'),
    phone_number: '689-689-0681',
  });
  for (let i = 1; i <= 50; i += 1) {
    teachers.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(60),
      phone_number: faker.phone.phoneNumberFormat(0),
    });
  }
  return teachers;
}
