const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('lab_comments', generate10LabComments(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_comments', null, {}); },
};

function generate10LabComments() {
  const labComments = [];
  labComments.push({
    id: 1,
    lab_report_id: '1',
    teacher_comment: 'First teacher comment',
  });
  for (let i = 0; i < 10; i += 1) {
    labComments.push({
      lab_report_id: faker.random.number(5) + 1,
      teacher_comment: faker.random.word(),
    });
  }
  return labComments;
}
