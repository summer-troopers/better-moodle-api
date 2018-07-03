/* eslint-env node, mocha */

const assert = require('assert');
const util = require('../../../src/helpers/util');

describe('util', () => {
  it('should sum 2 numbers', () => {
    assert.strictEqual(util.add(2, 5), 7);
  });
  // it('should return contents of a message', () => {
  //   const msg = new util.Message({
  //     to: 'test', from: 'tester', subject: 'Subject', text: 'TEXT',
  //   });
  //   assert.deepStrictEqual(msg.contents(), {
  //     to: 'test', from: 'tester', subject: 'Subject', text: 'TEXT',
  //   });
  // });
});
