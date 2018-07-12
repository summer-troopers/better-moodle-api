const assert = require('assert');
const jwt = require('jsonwebtoken');
const config = require('config');

const createAuthorizationVerifier = require('../../../src/middlewares/authorization-verifier');
const roles = require('../../../src/helpers/constants/roles');


const ENCRYPTED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXIiOnsiaWQiOjEsImZpcnN0TmFtZSI6IlNoeWFubmUiLCJsYXN0TmFtZSI6IkhlcnpvZyIsInBhc3N3b3JkIjoibmF4b3h1cWkiLCJwaG9uZU51bWJlciI6IjUwMS0zODItMDc0OSIsImVtYWlsIjoiV3ltYW4uTmlrb2xhdXNAZ21haWwuY29tIiwiaWRHcm91cCI6OX0sImlhdCI6MTUzMTc0MjkwMSwiZXhwIjoxNTMxODI5MzAxfQ.pXQbjgRi4x_0xkT2ngdYtZnJ9Glz6uiXNeKB7obUFho';

const userRepository = {
  exists(id, role) {
    return new Promise((resolve, reject) => {
      resolve(id === 1 && role === roles.STUDENT);
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
