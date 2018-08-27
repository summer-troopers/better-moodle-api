'use strict';

const faker = require('faker');
const { generateUniqueJobName } = require('../helpers/util');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Specialty = sequelize.import('../models/specialty.js');
    return Specialty.bulkCreate(generate20Specialties(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('specialties', null, {});
  },
};

function generate20Specialties() {
  const specialties = [];
  specialties.push({
    name: 'Developer',
    description: 'For developers :)',
  });
  for (let i = 1; i <= 20; i += 1) {
    specialties.push({
      name: generateUniqueJobName(specialties),
      description: faker.lorem.sentence(),
    });
  }
  return specialties;
}
