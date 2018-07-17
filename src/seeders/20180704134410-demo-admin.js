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
  const hash = await hashFactory.encrypt('admin');
  admins.push({
    first_name: 'admin',
    last_name: 'admin',
    email: 'admin@moodle.com',
    password: await hash.toString('hex'), // 'admin' - original password
    phone_number: '000-581-5483',
  });
  for (let i = 1; i <= 50; i += 1) {
    admins.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(60),
      phone_number: faker.phone.phoneNumberFormat(0),
    });
  }
  return admins;
}
