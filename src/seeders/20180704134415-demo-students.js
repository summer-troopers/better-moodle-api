const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) { return queryInterface.bulkInsert('students', await generate50Students(), {}); },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('students', null, {}); },
};


async function generate50Students() {
  const students = [];
  const hash = await hashFactory.encrypt('student');
  students.push({
    first_name: 'student',
    last_name: 'student',
    email: 'student@email.com',
    password: await hash.toString('hex'),
    phone_number: '689-689-0688',
    id_group: '1',
  });
  for (let i = 1; i <= 50; i += 1) {
    students.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(60),
      phone_number: faker.phone.phoneNumberFormat(0),
      id_group: faker.random.number(10) + 1,
    });
  }
  return students;
}
