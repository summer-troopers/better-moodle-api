module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const LabComment = sequelize.import('../models/lab_comment.js');
    return LabComment.bulkCreate([{
      labReportId: '1',
      teacherComment: 'First teacher comment',
      mark: '9',
    }], {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('lab_comments', null, {}); },
};
