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

function handleId(queryParams, Model, filter, queryParamsBindings) {
  if (!queryParams) return null;

  const incomingParamKeys = Object.keys(queryParams);
  const incomingParamValues = Object.values(queryParams);

  const modelChain = queryParamsBindings[incomingParamKeys[0]];
  if (!modelChain) return null;
  const queryParamId = incomingParamValues[0];

  const query = {
    ...filter,
    subQuery: false,
    ...buildIncludes(queryParamId, modelChain),
  };
  return Model.findAndCountAll(query);
}

async function appendDependentData(initialResults, dependentModel) {
  const dependencyName = getDependencyName(dependentModel);
  const dependentIds = initialResults.rows.map(model => model[`${dependencyName}Id`]);

  const dependencies = await dependentModel.findAll({
    where: { id: { $in: dependentIds } },
  });

  for (let i = 0; i < initialResults.rows.length; i += 1) {
    for (let j = 0; j < dependencies.length; j += 1) {
      if (initialResults.rows[i][`${dependencyName}Id`] === dependencies[j].id) {
        initialResults.rows[i][dependencyName] = dependencies[j];
      }
    }
  }
  return initialResults;
}

function getDependencyName(model) {
  return model.name.charAt(0).toLowerCase() + model.name.slice(1);
}

function projectDatabaseResponse(response, projector) {
  return {
    count: response.count,
    rows: response.rows.map(projector),
  };
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
  appendDependentData,
  projectDatabaseResponse,
};
