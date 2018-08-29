'use strict';

const errors = require('@feathersjs/errors');

module.exports = {
  notTaken: {
    email: createUserDataNotTakenAssert('email'),
    phoneNumber: createUserDataNotTakenAssert('phoneNumber'),
    name: assertNameNotTaken,
  },
};

function createUserDataNotTakenAssert(userDataName) {
  return async function assertUserDataNotTaken(userData, models, userId) {
    userId = parseInt(userId, 10) || 0;
    const users = await Promise.all(models.map(model => model.findOne({ where: { [userDataName]: userData } })));

    users.forEach((user) => {
      if (!user) return;
      if (user.id === userId) return;
      throw new errors.BadRequest(`${userDataName.toUpperCase()}_ALREADY_TAKEN`);
    });
  };
}

async function assertNameNotTaken(name, model, id) {
  id = parseInt(id, 10) || 0;
  const row = await model.findOne({ where: { name } });
  if (!row) return;
  if (row.id === id) return;
  throw new errors.BadRequest('NAME_ALREADY_TAKEN');
}
