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

// This next function is just an experiment for fun :)
// eslint-disable-next-line complexity
async function appendDependentDataDeep(initialResults, dependentModels) {
  const dependencyNames = [];
  dependentModels.forEach((Model) => {
    const name = getDependencyName(Model);
    dependencyNames.push(name);
  });
  const resultsAggregate = [initialResults];

  // eslint-disable-next-line complexity
  async function doWork(dependentModelsParam, index = 0, resultsAggregateParam) {
    if (index === dependentModelsParam.length) return null;

    const currentResults = resultsAggregateParam[index];
    const dependencyName = dependencyNames[index];

    const dependentIds = currentResults.rows.map(model => model[`${dependencyName}Id`]);

    const dependencies = await dependentModelsParam[index].findAll({
      where: { id: { $in: dependentIds } },
    });

    resultsAggregateParam.push({ count: 0, rows: [] });

    const nextResults = resultsAggregateParam[index + 1];

    for (let i = 0; i < currentResults.rows.length; i += 1) {
      for (let j = 0; j < dependencies.length; j += 1) {
        const currentId = currentResults.rows[i][`${dependencyName}Id`];
        if (currentId === dependencies[j].id) {
          nextResults.rows.push(dependencies[j]);
          break;
        }
      }
    }
    await doWork(dependentModelsParam, index + 1, resultsAggregateParam);
    for (let i = 0; i < currentResults.rows.length; i += 1) {
      currentResults.rows[i][dependencyName] = nextResults.rows[i];
    }

    return null;
  }

  await doWork(dependentModels, 0, resultsAggregate);

  return initialResults;
}

function projectDatabaseResponse(response, projector) {
  return {
    count: response.count,
    rows: response.rows.map(projector),
  };
}

function getDependencyName(model) {
  return model.name.charAt(0).toLowerCase() + model.name.slice(1);
}

function buildIncludes(param, modelsArg) {
  const models = [...modelsArg];
  models.reverse();
  return models.reduce((accumulator, model, index) => {
    if (index === 0) {
      accumulator.include = [
        {
          model,
          required: true,
          where: {
            id: param,
          },
        },
      ];
      return accumulator;
    }

    accumulator.include = [
      {
        model,
        required: true,
        include: accumulator.include,
      },
    ];
    return accumulator;
  }, {});
}

module.exports = {
  createMessage,
  permissions: createPermissions,
  buildIncludes,
  handleId,
  appendDependentData,
  appendDependentDataDeep,
  projectDatabaseResponse,
};
