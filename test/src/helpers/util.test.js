/* eslint-env node, mocha */

const assert = require('assert');
const util = require('../../../src/helpers/util');
const cryptoModule = require('../../../src/helpers/hash/crypto');
const bcryptModule = require('../../../src/helpers/hash/bcrypt');

describe('util', () => {
  it('Should create a message', () => {
    const message = util.createMessage('to', 'from', 'subject', 'text');
    assert.deepStrictEqual(message, {
      to: 'to', from: 'from', subject: 'subject', text: 'text',
    });
  });
});

describe('crypto-hash', () => {
  it('Should return same hash', async () => {
    const hash = await cryptoModule.encrypt('mypassword');
    assert.deepStrictEqual(hash, await cryptoModule.encrypt('mypassword'));
  });
});

describe('crypto-hash', () => {
  it('Should return true', async () => {
    const hash = await cryptoModule.encrypt('mypassword');
    assert.equal(true, await cryptoModule.compare('mypassword', hash));
  });
});

describe('crypto-hash', () => {
  it('Should return false', async () => {
    const hash = await cryptoModule.encrypt('mypassword');
    assert.equal(false, await cryptoModule.compare('myPassword', hash));
  });
});

describe('crypto-hash', () => {
  it('Should return false', async () => {
    const hash = await bcryptModule.encrypt('mypassword');
    assert.equal(false, await bcryptModule.compare('myPassword', hash));
  });
});

describe('crypto-hash', () => {
  it('Should return false', async () => {
    const hash = await bcryptModule.encrypt('mypassword');
    assert.equal(true, await bcryptModule.compare('mypassword', hash));
  });
});
