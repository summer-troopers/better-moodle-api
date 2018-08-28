const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const CourseInstanceSpecialty = sequelize.import('../models/course_instance-specialty.js');
    const CourseInstance = sequelize.import('../models/course_instance.js');
    const Specialty = sequelize.import('../models/specialty.js');
    return CourseInstanceSpecialty.bulkCreate(await generate50Connections(CourseInstance, Specialty), {});
  },

  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('courses_specialties', null, {});
  },
};

async function generate50Connections(CourseInstance, Specialty) {
  const courseInstances = await CourseInstance.findAll({ attributes: ['id'] });
  const specialties = await Specialty.findAll({ attributes: ['id'] });
  const connections = [];
  connections.push({
    specialtyId: '1',
    courseInstanceId: '1',
  });
  for (let i = 0; i < 50; i += 1) {
    const specIndex = faker.random.number(specialties.length - 1);
    const courseInstanceIndex = faker.random.number(courseInstances.length - 1);
    connections.push({
      specialtyId: specialties[specIndex].id,
      courseInstanceId: courseInstances[courseInstanceIndex].id,
    });
  }
  return connections;
}
