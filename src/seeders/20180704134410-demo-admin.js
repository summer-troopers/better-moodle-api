'use strict';

const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Admin = sequelize.import('../models/admin');
    return Admin.bulkCreate(await generate50Admins(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('admins', null, {}); },
};

async function generate50Admins() {
  const admins = [];
  admins.push({
    firstName: 'administrator',
    lastName: 'admin',
    email: 'administrator@moodle.com',
    password: await hashFactory.encrypt('administrator'), // 'administrator' - original password
    phoneNumber: '000-581-5483',
  });
  for (let i = 1; i <= 50; i += 1) {
    admins.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: generateUniqueEmail(i, admins),
      password: faker.random.alphaNumeric(60),
      phoneNumber: generateUniqueNumber(i, admins),
    });
  }
  return admins;
}

function generateUniqueEmail(i, admins) {
  let genEmail;
  const predicate = object => object.email === genEmail;
  while (true) {
    genEmail = faker.internet.email().toLocaleLowerCase();
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
