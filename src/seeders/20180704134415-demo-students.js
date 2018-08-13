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
  students.push({
    first_name: 'student',
    last_name: 'student',
    email: 'student@email.com',
    password: await hashFactory.encrypt('student'),
    phone_number: '689-689-0688',
    group_id: '1',
  });
  for (let i = 1; i <= 50; i += 1) {
    students.push({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: generateUniqueEmail(i, students),
      password: faker.random.alphaNumeric(60),
      phone_number: generateUniqueNumber(i, students),
      group_id: faker.random.number(10) + 1,
    });
  }
  return students;
}

function generateUniqueEmail(i, students) {
  let genEmail;
  const predicate = object => object.email === genEmail;
  while (true) {
    genEmail = faker.internet.email();
    if (!students.find(predicate)) break;
  }
  return genEmail;
}

function generateUniqueNumber(i, students) {
  let genNumber;
  const predicate = object => object.phone_number === genNumber;
  while (true) {
    genNumber = faker.phone.phoneNumberFormat(0);
    if (!students.find(predicate)) break;
  }
  return genNumber;
}
