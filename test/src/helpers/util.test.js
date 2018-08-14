/* eslint-env node, mocha */

const assert = require('assert');
const util = require('../../../src/helpers/util');

const truePermissions = {
  admin: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  teacher: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
  student: {
    create: false,
    read: true,
    update: false,
    delete: false,
  },
};

describe('util', () => {
  it('Should create a message', () => {
    const message = util.createMessage('to', 'from', 'subject', 'text');
    assert.deepStrictEqual(message, {
      to: 'to', from: 'from', subject: 'subject', text: 'text',
    });
  });
  it('Should validate a permission', () => {
    const result = util.permissions('crud|r|r|');
    assert.deepStrictEqual(result, truePermissions);
  });

  describe('buildIncludes', () => {
    it('Should return expected models', () => {
      const models = ['Student', 'Group', 'Specialty'];
      const param = 1;
      const expected = {
        include: [{
          model: 'Student',
          required: true,
          include: [{
            model: 'Group',
            required: true,
            include: [{
              model: 'Specialty',
              required: true,
              where: {
                id: param,
              },
            }],
          }],
        }],
      };

      assert.deepEqual(util.buildIncludes(param, models), expected);
    });
  });
});
