const assert = require('assert');
const jwt = require('jsonwebtoken');
const config = require('config');

const createAuthorizationVerifier = require('../../../src/middlewares/authorization-verifier');
const roles = require('../../../src/helpers/constants/roles');


const ENCRYPTED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidGVhY2hlciIsInVzZXIiOjEsImlhdCI6MTUzMTkxMDIxOSwiZXhwIjo4NjQxNTMxOTEwMjE5fQ.v0YZpn0beF5x7fqCy_0j0A1011PBhoz6ofKZVo2GPvo';

const userRepository = {
  exists(id, role) {
    return new Promise((resolve, reject) => {
      resolve(id === 1 && role === roles.TEACHER);
    });
  },
};

const request = {
  headers: {
    token: ENCRYPTED_TOKEN,
  },
};

let success = true;

function next(error) {
  if (error) {
    success = false;
    console.error(error);
  }
}

const response = {};

describe('authorization-verifier', () => {
  const [extractAuthorizationToken, verifyUserId] = createAuthorizationVerifier(userRepository).validateUser;
  it('Should extract authorization token', () => {
    extractAuthorizationToken(request, response, next);
    const decoded = jwt.verify(ENCRYPTED_TOKEN, config.jwtconf.secret);
    assert.deepStrictEqual(request.token, decoded);
    assert.strictEqual(success, true);
  });
  it('Should check if user id exists in db', async () => {
    await verifyUserId(request, response, next);
    assert.strictEqual(success, true);
  });
});
