/* eslint-env node, mocha */

const assert = require('assert');
const cryptoModule = require('../../../../src/helpers/hash/crypto');

describe('crypto-hash', () => {
  it('Should return same hash', async () => {
    const hash = await cryptoModule.encrypt('mypassword');
    assert.deepStrictEqual(hash, await cryptoModule.encrypt('mypassword'));
  });
  it('Should return true', async () => {
    const hash = await cryptoModule.encrypt('mypassword');
    assert.equal(await cryptoModule.compare('mypassword', hash), true);
  });
  it('Should return false', async () => {
    const hash = await cryptoModule.encrypt('mypassword');
    assert.equal(await cryptoModule.compare('myPassword', hash), false);
  });
});
