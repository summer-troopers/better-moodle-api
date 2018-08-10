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

/* function generateUniqueNumber(i, admins) {
  let number = faker.phone.phoneNumberFormat(0);
  for (let j = 0; j < i; j += 1) {
    if (number === admins[j].phone_number) {
      number = faker.phone.phoneNumberFormat(0);
      return number;
    }
  }
  return number;
}

function generateUniqueEmail(i, admins) {
  let email = faker.internet.email();
  for (let j = 0; j < i; j += 1) {
    if (email === admins[j].email) {
      email = faker.internet.email();
      return email;
    }
  }
  return email;
} */


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
