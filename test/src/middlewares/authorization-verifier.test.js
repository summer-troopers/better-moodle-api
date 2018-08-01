const assert = require('assert');
const jwt = require('jsonwebtoken');
const config = require('config');

const createAuthorizationVerifier = require('../../../src/middlewares/authorization-verifier');
const roles = require('../../../src/helpers/constants/roles');


const user = {
  userRole: roles.TEACHER,
  user: 1,
};

const ENCRYPTED_TOKEN = jwt.sign(user, config.jwtconf.secret, config.jwtconf.time);

const request = {
  headers: {
    token: ENCRYPTED_TOKEN,
  },
};

const userRepository = {
  exists(id, role) {
    return new Promise((resolve, reject) => {
      resolve(id === 1 && role === roles.TEACHER);
    });
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
