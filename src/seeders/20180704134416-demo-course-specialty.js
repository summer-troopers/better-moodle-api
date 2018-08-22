const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const CourseSpecialty = sequelize.import('../models/course_specialty.js');
    const Course = sequelize.import('../models/course.js');
    const Specialty = sequelize.import('../models/specialty.js');
    return CourseSpecialty.bulkCreate(await generate10Connections(Course, Specialty), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses_specialties', null, {}); },
};

async function generate10Connections(Course, Specialty) {
  const courses = await Course.findAll({ attributes: ['id'] });
  const specialties = await Specialty.findAll({ attributes: ['id'] });
  const connections = [];
  connections.push({
    specialtyId: '1',
    courseId: '1',
  });
  for (let i = 0; i < 10; i += 1) {
    const specIndex = faker.random.number(specialties.length - 1);
    const courseIndex = faker.random.number(courses.length - 1);
    connections.push({
      specialtyId: specialties[specIndex].id,
      courseId: courses[courseIndex].id,
    });
  }
  return connections;
}
