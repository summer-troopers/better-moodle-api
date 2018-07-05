'use strict';

const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('courses', generate50Courses(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses', null, {}); },
};

function generate50Courses() {
  const courses = [];
  for (let i = 1; i <= 50; i += 1) {
    courses.push({ name: faker.name.jobArea() });
  }
  return courses;
}
