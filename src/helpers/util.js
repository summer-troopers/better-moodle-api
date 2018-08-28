'use strict';

const faker = require('faker');
const errors = require('@feathersjs/errors');

module.exports = {
  createMessage,
  permissions: createPermissions,
  buildIncludes,
  handleId,
  appendParentData,
  appendParentDataDeep,
  appendDependentData,
  appendDependentDataThrough,
  appendDependentCount,
  generatePhoneNumber,
  generateUniqueEmail,
  generateUniquePhoneNumber,
  generateUniqueJobName,
  detectDuplicate,
};

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

// eslint-disable-next-line complexity
async function appendParentData(rows, parentModel) {
  if (!rows || rows.length === 0) return rows;
  const parentColumnName = getLowerCaseName(parentModel);
  const parentsIds = rows.map(model => model[`${parentColumnName}Id`]);

  const parents = await parentModel.findAll({
    where: { id: { $in: parentsIds } },
  });

  rows.forEach((row) => {
    const matchingParentRow = parents.find(parentRow => parentRow.id === row[`${parentColumnName}Id`]);
    row[parentColumnName] = Object.assign({}, row[parentColumnName], matchingParentRow, matchingParentRow.dataValues);
  });

  return rows;
}

async function appendDependentCount(rows, parentModel, dependentModel) {
  if (!rows || rows.length === 0) return rows;

  const parentName = getLowerCaseName(parentModel);
  const dependentName = getLowerCaseName(dependentModel);
  const parentsIds = rows.map(model => model.id);

  const dependencies = await dependentModel.findAll({
    where: { [`${parentName}Id`]: { $in: parentsIds } },
  });

  rows.forEach((parentRow) => {
    const matchingDependencies = dependencies.filter((dependentRow) => {
      return dependentRow[`${parentName}Id`] === parentRow.id;
    });
    parentRow[`${dependentName}Count`] = matchingDependencies.length;
  });

  return rows;
}

async function appendDependentData(rows, /* models */{ parent, dependent }) {
  if (!rows || rows.length === 0) return rows;

  const parentName = getLowerCaseName(parent);
  const dependentName = getLowerCaseName(dependent);
  const parentsIds = rows.map(model => model.id);

  const dependencies = await dependent.findAll({
    where: { [`${parentName}Id`]: { $in: parentsIds } },
  });

  rows.forEach((parentRow) => {
    const matchingDependencies = dependencies.filter((dependentRow) => {
      return dependentRow[`${parentName}Id`] === parentRow.id;
    });
    parentRow[`${dependentName}s`] = Object.assign(
      [],
      parentRow[`${dependentName}s`],
      matchingDependencies,
    );
  });

  return rows;
}

async function appendDependentDataThrough(rows, /* models */{ parent, dependent, through }) {
  if (!rows || rows.length === 0) return rows;

  const parentName = getLowerCaseName(parent);
  const dependentName = getLowerCaseName(dependent);
  const parentsIds = rows.map(model => model.id);

  const throughRows = await through.findAll({
    where: { [`${parentName}Id`]: { $in: parentsIds } },
  });

  const dependentIds = throughRows.map(row => row[`${dependentName}Id`]);

  const dependencies = await dependent.findAll({
    where: { id: { $in: dependentIds } },
  });

  rows.forEach((row) => {
    const rowDependencies = throughRows
      .filter(throughRow => throughRow[`${parentName}Id`] === row.id)
      .map((throughRow) => {
        return dependencies.find(dependency => dependency.id === throughRow[`${dependentName}Id`]);
      });

    row[`${dependentName}s`] = Object.assign(
      [],
      row[`${dependentName}s`],
      rowDependencies,
    );
  });

  return rows;
}

// This next function is just an experiment for fun :)
// eslint-disable-next-line complexity
async function appendParentDataDeep(rows, parentModelChain) {
  const parentsNames = [];
  parentModelChain.forEach((parentModel) => {
    const parentName = getLowerCaseName(parentModel);
    parentsNames.push(parentName);
  });
  const temp2DStorage = [rows];

  // eslint-disable-next-line complexity
  async function doWork(index = 0) {
    if (index === parentModelChain.length) return null;

    const currentRows = temp2DStorage[index];
    const parentName = parentsNames[index];

    const parentsIds = currentRows.map(model => model[`${parentName}Id`]);

    const parents = await parentModelChain[index].findAll({
      where: { id: { $in: parentsIds } },
    });

    temp2DStorage.push([]);

    const nextRows = temp2DStorage[index + 1];

    for (let i = 0; i < currentRows.length; i += 1) {
      const requiredParentId = currentRows[i][`${parentName}Id`];
      const matchingParent = parents.find(parent => parent.id === requiredParentId);
      if (!matchingParent) {
        throw new errors.GeneralError('PARENT_NOT_FOUND', {
          function: 'appendParentDataDeep',
          file: './src/helpers/util.js',
          cause: 'unknown',
          severity: 'HUMAN_LOGIC_ERROR',
          solution: 'tell Roman to fix it',
        });
      }
      nextRows.push(matchingParent);
    }
    await doWork(index + 1);
    for (let i = 0; i < currentRows.length; i += 1) {
      currentRows[i][parentName] = Object.assign(
        {},
        currentRows[i][parentName],
        nextRows[i],
        nextRows[i].dataValues,
      );
    }

    return null;
  }

  await doWork();

  return rows;
}

function getLowerCaseName(model) {
  return model.name.charAt(0).toLowerCase() + model.name.slice(1);
}

function buildIncludes(param, models) {
  const modelsCopy = [...models];
  modelsCopy.reverse();
  return modelsCopy.reduce((accumulator, model, index) => {
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

function generatePhoneNumber() {
  const prefixes = ['06', '07'];
  const chosenPrefix = faker.random.arrayElement(prefixes);
  const rest = faker.random.number({ min: 1000000, max: 9999999 });

  return `${chosenPrefix}${rest}`;
}

function generateUniqueEmail(emails) {
  let genEmail = faker.internet.email().toLocaleLowerCase();
  const predicate = object => object.email === genEmail;
  while (emails.find(predicate)) {
    genEmail = faker.internet.email().toLocaleLowerCase();
  }
  return genEmail;
}

function generateUniquePhoneNumber(phoneNumbers) {
  let genNumber = generatePhoneNumber();
  const predicate = object => object.phone_number === genNumber;
  while (phoneNumbers.find(predicate)) {
    genNumber = generatePhoneNumber();
  }
  return genNumber;
}

function generateUniqueJobName(names) {
  let genName = faker.name.jobDescriptor();
  const predicate = object => object.name === genName;
  while (names.find(predicate)) {
    genName = faker.name.jobDescriptor();
  }
  return genName;
}

function detectDuplicate(array) {
  const sorted = array.slice().sort();

  for (let i = 0; i < sorted.length - 1; i += 1) {
    if (sorted[i] === sorted[i + 1]) return true;
  }

  return false;
}
