'use strict';

const faker = require('faker');
const { generateUniqueJobName } = require('../helpers/util');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Course = sequelize.import('../models/course.js');
    return Course.bulkCreate(generate20Courses(), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('courses', null, {});
  },
};

function generate20Courses() {
  const courses = [];
  courses.push({
    name: 'Artificial Intelligence',
    description: 'Learn about AI.',
  });
  for (let i = 1; i <= 20; i += 1) {
    courses.push({
      name: generateUniqueJobName(courses),
      description: faker.lorem.sentence(),
    });
  }
  return courses;
}
