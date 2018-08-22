const faker = require('faker');
const hashFactory = require('../helpers/hash/hash-factory')();
const { generateUniqueEmail, generateUniqueNumber } = require('../helpers/util');

module.exports = {
  // eslint-disable-next-line no-unused-vars, no-use-before-define
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Group = sequelize.import('../models/group.js');
    const Student = sequelize.import('../models/student.js');
    return Student.bulkCreate(await generate50Students(Group), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('students', null, {}); },
};

async function generate50Students(Group) {
  const groups = await Group.findAll({ attributes: ['id'] });
  const students = [];
  students.push({
    firstName: 'student',
    lastName: 'student',
    email: 'student@email.com',
    password: await hashFactory.encrypt('student'),
    phoneNumber: '068689688',
    groupId: '1',
  });
  for (let i = 1; i <= 50; i += 1) {
    const groupIndex = faker.random.number(groups.length - 1);
    students.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: generateUniqueEmail(students),
      password: faker.random.alphaNumeric(60),
      phoneNumber: generateUniqueNumber(i, students),
      groupId: groups[groupIndex].id,
    });
  }
  return students;
}
