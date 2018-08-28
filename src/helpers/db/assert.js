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
  return async function assertUserDataNotTaken(userData, models) {
    const users = await Promise.all(models.map(model => model.findOne({ where: { [userDataName]: userData } })));

    users.forEach((user) => {
      if (user) throw new errors.BadRequest(`${userDataName.toUpperCase()}_ALREADY_TAKEN`);
    });
  };
}

async function assertNameNotTaken(name, model) {
  const row = await model.findOne({ where: { name: data.name } });
  if (row) throw new errors.BadRequest('NAME_ALREADY_TAKEN');
}
