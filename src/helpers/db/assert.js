'use strict';

const errors = require('@feathersjs/errors');

module.exports = {
  notTaken: {
    email: assertEmailNotTaken,
    name: assertNameNotTaken,
  },
};


async function assertEmailNotTaken(email, models) {
  const userRequests = [];

  models.forEach((model) => {
    userRequests.push(model.findOne({ where: { email } }));
  });

  const users = await Promise.all(userRequests);

  for (let i = 0; i < users.length; i += 1) {
    if (users[i]) throw new errors.BadRequest('EMAIL_ALREADY_TAKEN');
  }
}

async function assertNameNotTaken(name, model) {
  const row = await model.findOne({ where: { name: data.name } });
  if (row) throw new errors.BadRequest('NAME_ALREADY_TAKEN');
}
