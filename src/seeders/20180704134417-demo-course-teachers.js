const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('courses_teachers', generate10Connections(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses_teachers', null, {}); },
};

function generate10Connections() {
  const connections = [];
  connections.push({
    teacher_id: '1',
    course_id: '1',
  });
  for (let i = 0; i <= 10; i += 1) {
    connections.push({
      teacher_id: faker.random.number(40) + 1,
      course_id: faker.random.number(10) + 1,
    });
  }
  return connections;
}
