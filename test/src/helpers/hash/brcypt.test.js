/* eslint-env node, mocha */

const assert = require('assert');
const bcryptModule = require('../../../../src/helpers/hash/bcrypt');

describe('bcrypt-hash', () => {
  it('Should return false', async () => {
    const hash = await bcryptModule.encrypt('mypassword');
    assert.equal(await bcryptModule.compare('myPassword', hash), false);
  });
  it('Should return false', async () => {
    const hash = await bcryptModule.encrypt('mypassword');
    assert.equal(await bcryptModule.compare('mypassword', hash), true);
  });
});
