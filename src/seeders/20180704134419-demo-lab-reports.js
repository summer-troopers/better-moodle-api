const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('lab_reports', generateLabReports(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_reports', null, {}); },
};

function generateLabReports() {
  const labTask = [];
  labTask.push({
    id: 1,
    student_id: '1',
    lab_task_id: '1',
    mongo_file_id: '1',
  });
  return labTask;
}
