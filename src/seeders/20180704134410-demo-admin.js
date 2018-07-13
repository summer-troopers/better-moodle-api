'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('admins', generate50Admins(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('admins', null, {}); },
};

function generate50Admins() {
  const admins = [];
  admins.push({
    first_name: 'admin',
    last_name: 'admin',
    email: 'admin@moodle.com',
    password: 'admin',
    phone_number: '000-581-5483',
  });
  for (let i = 1; i <= 50; i += 1) {
    admins.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8, 16),
      phone_number: faker.phone.phoneNumberFormat(0),
    });
  }
  return admins;
}
