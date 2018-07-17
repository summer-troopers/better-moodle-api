'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const hashPassword = require('../helpers/hash/hash-factory')();

module.exports = function createAuthenticationRoute(repository) {
  const router = express.Router();

  async function loginUser(request, response) {
    const result = await repository.getUser(request.body);
    if (!result) return response.sendStatus(404);
    const token = jwt.sign({ role: result[0], user: result[1].id }, config.jwtconf.secret, config.jwtconf.time);
    return response.status(200).json({ token });
  }

  async function comparePassword(request, response, next) {
    const passwordDb = await repository.getUser(request.body);
    try {
      const compareResult = await hashPassword.compare(request.body.password, passwordDb[1].password);
      if (compareResult) next();
      else throw compareResult;
    } catch (error) {
      response.sendStatus(403);
    }
  }

  router.route('/')
    .post(comparePassword, loginUser);

  return router;
};
