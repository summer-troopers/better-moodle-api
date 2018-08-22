const faker = require('faker');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async up(queryInterface, Sequelize) {
    const { sequelize } = queryInterface;
    const Group = sequelize.import('../models/group.js');
    const Specialty = sequelize.import('../models/specialty.js');
    return Group.bulkCreate(await generate50Groups(Specialty), {});
  },
  // eslint-disable-next-line no-unused-vars
  down(queryInterface, Sequelize) { return queryInterface.bulkDelete('groups', null, {}); },
};

async function generate50Groups(Specialty) {
  const specialties = await Specialty.findAll({ attributes: ['id'] });
  const group = [];
  group.push({
    name: 'AI-151',
    specialtyId: '1',
  });
  for (let i = 1; i <= 50; i += 1) {
    const specIndex = faker.random.number(specialties.length - 1);
    group.push({
      name: `${getRandomLetters()}${faker.random.number(60)}`, // eslint-disable-line no-unused-vars, no-use-before-define
      specialtyId: specialties[specIndex].id,
    });
  }
  return group;
}

function getRandomLetters() {
  const list = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 3; i += 1) {
    const random = Math.floor(Math.random() * list.length);
    result += list.charAt(random);
  }
  return result;
}
