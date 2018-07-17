/* eslint-env node, mocha */

const assert = require('assert');
const util = require('../../../src/helpers/util');

describe('util', () => {
  it('Should create a message', () => {
    const message = util.createMessage('to', 'from', 'subject', 'text');
    assert.deepStrictEqual(message, {
      to: 'to', from: 'from', subject: 'subject', text: 'text',
    });
  });
});
