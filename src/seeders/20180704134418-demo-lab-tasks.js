const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('lab_tasks', generateLabTasks(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_tasks', null, {}); },
};

function generateLabTasks() {
  const labTask = [];
  labTask.push({
    id: 1,
    teacher_id: '1',
    course_id: '1',
    mongo_file_id: '1',
  });
  return labTask;
}
