const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('lab_tasks', generate10LabTasks(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_tasks', null, {}); },
};

function generate10LabTasks() {
  const labTasks = [];
  labTasks.push({
    id: 1,
    teacher_id: '1',
    course_id: '1',
    mongo_file_id: '1',
  });
  for (let i = 0; i < 10; i += 1) {
    labTasks.push({
      teacher_id: faker.random.number(40) + 1,
      course_id: faker.random.number(10) + 1,
      mongo_file_id: faker.random.number(10) + 1,
    });
  }
  return labTasks;
}
