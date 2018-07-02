/* eslint-env node, mocha */

const assert = require('assert');
const util = require('../../../src/helpers/util');

describe('util', () => {
  it('should sum 2 numbers', () => {
    assert.equal(util.add(2, 5), 7);
  });
});
