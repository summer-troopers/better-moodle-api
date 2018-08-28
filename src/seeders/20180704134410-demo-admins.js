'use strict';

const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();
const { generateUniqueEmail, generateUniquePhoneNumber } = require('../helpers/util');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Admin = sequelize.import('../models/admin');
    return Admin.bulkCreate(await generate50Admins(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('admins', null, {});
  },
};

async function generate50Admins() {
  const admins = [];
  admins.push({
    firstName: 'administrator',
    lastName: 'admin',
    email: 'administrator@moodle.com',
    password: await hashFactory.encrypt('administrator'), // 'administrator' - original password
    phoneNumber: '060060060',
  });
  for (let i = 1; i <= 50; i += 1) {
    admins.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: generateUniqueEmail(admins),
      password: faker.random.alphaNumeric(60),
      phoneNumber: generateUniquePhoneNumber(admins),
    });
  }
  return admins;
}
