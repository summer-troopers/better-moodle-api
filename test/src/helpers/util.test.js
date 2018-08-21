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

  it('Should detect a duplicate', () => {
    const arr = ['a', 'b', 'b', 'c'];
    assert.strictEqual(util.detectDuplicate(arr), true);
  });

  it('Should not detect any duplicates', () => {
    const arr = ['a', 'b', 'c'];
    assert.strictEqual(util.detectDuplicate(arr), false);
  });

  it('Should return a phone number according to the format /^0\s?[67]\d{1}\s?\d{3}\s?\d{3}$/', () => {
    const phoneNumber = util.generatePhoneNumber();
    const regex = /^0\s?[67]\d{1}\s?\d{3}\s?\d{3}$/;
    assert.strictEqual(regex.test(phoneNumber), true);
  });

  it('Should create 10 unique phone numbers', () => {
    const phoneNumbers = [];
    for (let i = 0; i < 10; i += 1) {
      phoneNumbers.push(util.generateUniqueNumber(phoneNumbers));
    }
    assert.strictEqual(util.detectDuplicate(phoneNumbers), false);
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
