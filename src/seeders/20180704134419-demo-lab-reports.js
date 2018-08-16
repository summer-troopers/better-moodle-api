const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const LabReport = sequelize.import('../models/lab_report.js');
    const Student = sequelize.import('../models/teacher.js');
    const LabTask = sequelize.import('../models/lab_task.js');
    return LabReport.bulkCreate(await generate10LabReports(LabTask, Student), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_reports', null, {}); },
};

async function generate10LabReports(LabTask, Student) {
  const tasks = await LabTask.findAll({ attributes: ['id'] });
  const students = await Student.findAll({ attributes: ['id'] });
  const labReports = [];
  labReports.push({
    id: 1,
    studentId: '1',
    labTaskId: '1',
    mongoFileId: '1',
  });
  for (let i = 0; i < 10; i += 1) {
    const taskIndex = faker.random.number(tasks.length - 1);
    const studentIndex = faker.random.number(students.length - 1);
    labReports.push({
      studentId: students[studentIndex].id,
      labTaskId: tasks[taskIndex].id,
      mongoFileId: faker.random.number(10) + 1,
    });
  }
  return labReports;
}
