'use strict';

const errors = require('@feathersjs/errors');
const logger = require('../services/winston/logger');

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

function handleId(queryParams, Model, filter, queryParamsBindings, projector) {
  if (!queryParams) return null;

  const incomingParamKeys = Object.keys(queryParams);
  const incomingParamValues = Object.values(queryParams);

  const modelChain = queryParamsBindings[incomingParamKeys[0]];
  const queryParamId = incomingParamValues[0];

  const query = {
    ...filter,
    subQuery: false,
    ...buildIncludes(queryParamId, modelChain),
  };
  return Model.findAndCountAll(query)
    .then((results) => {
      if (!Array.isArray(results.rows)) {
        logger.error('NOT_AN_ARRAY');
        throw new errors.GeneralError('NOT_AN_ARRAY');
      }
      const newRows = results.rows.map(projector);
      return {
        count: results.count,
        rows: newRows,
      };
    });
}

function buildIncludes(param, models) {
  models.reverse();
  return models.reduce((accumulator, model, index) => {
    if (index === 0) {
      accumulator.include = [{
        model,
        attributes: ['id'],
        required: true,
        where: {
          id: param,
        },
      }];
      return accumulator;
    }

    accumulator.include = [{
      model,
      attributes: ['id'],
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
  handleId,
};
