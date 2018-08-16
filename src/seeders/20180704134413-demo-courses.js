'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Course = sequelize.import('../models/course.js');
    return Course.bulkCreate(generate20Courses(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses', null, {}); },
};

function generate20Courses() {
  const courses = [];
  courses.push({ name: 'Artificial Intelligence' });
  for (let i = 1; i <= 20; i += 1) {
    courses.push({ name: generateUniqueName(i, courses) });
  }
  return courses;
}

function generateUniqueName(i, courses) {
  let genName;
  const predicate = object => object.name === genName;
  while (true) {
    genName = faker.name.jobDescriptor();
    if (!courses.find(predicate)) break;
  }
  return genName;
}
