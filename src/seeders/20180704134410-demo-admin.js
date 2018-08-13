'use strict';

const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) { return queryInterface.bulkInsert('admins', await generate50Admins(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('admins', null, {}); },
};

async function generate50Admins() {
  const admins = [];
  admins.push({
    first_name: 'administrator',
    last_name: 'admin',
    email: 'administrator@moodle.com',
    password: await hashFactory.encrypt('administrator'), // 'administrator' - original password
    phone_number: '000-581-5483',
  });
  for (let i = 1; i <= 50; i += 1) {
    admins.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: generateUniqueEmail(i, admins),
      password: faker.random.alphaNumeric(60),
      phone_number: generateUniqueNumber(i, admins),
    });
  }
  return admins;
}

function generateUniqueEmail(i, admins) {
  let genEmail;
  const predicate = object => object.email === genEmail;
  while (true) {
    genEmail = faker.internet.email();
    if (!admins.find(predicate)) break;
  }
  return genEmail;
}

function generateUniqueNumber(i, admins) {
  let genNumber;
  const predicate = object => object.phone_number === genNumber;
  while (true) {
    genNumber = faker.phone.phoneNumberFormat(0);
    if (!admins.find(predicate)) break;
  }
  return genNumber;
}
