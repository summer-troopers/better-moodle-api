const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('courses_teachers', generate50Connections(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('courses_teachers', null, {}); },
};

function generate50Connections() {
  const conn = [];
  for (let i = 0; i <= 10; i += 1) {
    conn.push({
      id_teacher: faker.random.number(49) + 1,
      id_course: faker.random.number(49) + 1,
    });
  }
  return conn;
}
