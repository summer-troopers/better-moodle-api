const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Group = sequelize.import('../models/group.js');
    const Specialty = sequelize.import('../models/specialty.js');
    return Group.bulkCreate(await generate25Groups(Specialty), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('groups', null, {});
  },
};

async function generate25Groups(Specialty) {
  const specialties = await Specialty.findAll({ attributes: ['id'] });
  const group = [];
  group.push({
    name: 'AI-151',
    specialtyId: '1',
  });
  for (let i = 1; i <= 25; i += 1) {
    const specIndex = faker.random.number(specialties.length - 1);
    group.push({
      name: generateRandomGroupName(), // eslint-disable-line no-unused-vars, no-use-before-define
      specialtyId: specialties[specIndex].id,
    });
  }
  return group;
}

function generateRandomGroupName() {
  return `${generateRandomCharSequence(3)}${faker.random.number({ min: 100, max: 200 })}`;
}

function generateRandomCharSequence(length) {
  const dictionary = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const random = faker.random.number(dictionary.length - 1);
    result += dictionary.charAt(random);
  }
  return result;
}
