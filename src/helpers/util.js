'use strict';

function createMessage(to, from, subject, text) {
  const message = {
    to,
    from,
    subject,
    text,
  };
  return message;
}

function divisionString(string) {
  const [admin, teacher, student] = string.split('|');

  return {
    admin,
    teacher,
    student,
  };
}

function getPermission(permissions) {
  return {
    create: permissions.includes('c'),
    read: permissions.includes('r'),
    update: permissions.includes('u'),
    delete: permissions.includes('d'),
  };
}

function createPermissions(permissions) {
  const users = divisionString(permissions);
  return {
    admin: getPermission(users.admin),
    teacher: getPermission(users.teacher),
    student: getPermission(users.student),
  };
}

function buildIncludes(param, models) {
  models.reverse();
  return models.reduce((accumulator, model, index) => {
    if (index === 0) {
      accumulator.include = [{
        model,
        required: true,
        where: {
          id: param,
        },
      }];
      return accumulator;
    }

    accumulator.include = [{
      model,
      required: true,
      include: accumulator.include,
    }];
    return accumulator;
  }, {});
}

module.exports = {
  createMessage,
  permissions: createPermissions,
  buildIncludes,
};
