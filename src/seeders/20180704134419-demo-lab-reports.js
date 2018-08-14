const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('lab_reports', generate10LabReports(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_reports', null, {}); },
};

function generate10LabReports() {
  const labReports = [];
  labReports.push({
    id: 1,
    student_id: '1',
    lab_task_id: '1',
    mongo_file_id: '1',
  });
  for (let i = 0; i < 10; i += 1) {
    labReports.push({
      student_id: faker.random.number(40) + 1,
      lab_task_id: faker.random.number(10) + 1,
      mongo_file_id: faker.random.number(10) + 1,
    });
  }
  return labReports;
}
