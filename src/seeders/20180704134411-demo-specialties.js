'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Specialty = sequelize.import('../models/specialty.js');
    return Specialty.bulkCreate(generate20Specialties(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('specialties', null, {}); },
};

function generate20Specialties() {
  const specialties = [];
  specialties.push({
    name: 'Developer',
  });
  for (let i = 1; i <= 20; i += 1) {
    specialties.push({
      name: generateUniqueName(i, specialties),
    });
  }
  return specialties;
}

function generateUniqueName(i, specialties) {
  let genName;
  const predicate = object => object.name === genName;
  while (true) {
    genName = faker.name.jobDescriptor();
    if (!specialties.find(predicate)) break;
  }
  return genName;
}
