'use strict';

const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();
const { generateUniqueEmail, generateUniquePhoneNumber } = require('../helpers/util');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Teacher = sequelize.import('../models/teacher.js');
    return Teacher.bulkCreate(await generate250Teachers(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('teachers', null, {});
  },
};

async function generate250Teachers() {
  const teachers = [];
  teachers.push({
    firstName: 'teacher',
    lastName: 'teacher',
    email: 'teacher@email.com',
    password: await hashFactory.encrypt('teacher'),
    phoneNumber: '068115681',
  });
  for (let i = 1; i <= 250; i += 1) {
    teachers.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: generateUniqueEmail(teachers),
      password: faker.random.alphaNumeric(60),
      phoneNumber: generateUniquePhoneNumber(teachers),
    });
  }
  return teachers;
}
