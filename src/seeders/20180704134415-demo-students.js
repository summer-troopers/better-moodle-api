const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  up(queryInterface, Sequelize) { return queryInterface.bulkInsert('students', generate50Students(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('students', null, {}); },
};


function generate50Students() {
  const students = [];
  students.push({
    first_name: 'student',
    last_name: 'student',
    email: 'student@email.com',
    password: 'student',
    phone_number: '689-689-0688',
    id_group: '1',
  });
  for (let i = 1; i <= 50; i += 1) {
    students.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8, 16),
      phone_number: faker.phone.phoneNumberFormat(0),
      id_group: faker.random.number(10) + 1,
    });
  }
  return students;
}
