const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const LabComment = sequelize.import('../models/lab_comment.js');
    const LabReport = sequelize.import('../models/lab_report.js');
    return LabComment.bulkCreate(await generate10LabComments(LabReport), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_comments', null, {}); },
};

async function generate10LabComments(LabReport) {
  const reports = await LabReport.findAll({ attributes: ['id'] });
  const labComments = [];
  labComments.push({
    id: 1,
    labReportId: '1',
    teacherComment: 'First teacher comment',
    mark: '9',
  });
  for (let i = 0; i < 10; i += 1) {
    const reportIndex = faker.random.number(reports.length - 1);
    labComments.push({
      labReportId: reports[reportIndex].id,
      teacherComment: faker.random.word(),
      mark: faker.random.number(9) + 1,
    });
  }
  return labComments;
}
