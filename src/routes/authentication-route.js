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
    const userData = {
      id: result[1].id,
      firstName: result[1].firstName,
      lastName: result[1].lastName,
      phoneNumber: result[1].phoneNumber,
      email: result[1].email,
    };
    return response.status(200).json({ token, userData });
  }

  async function comparePassword(request, response, next) {
    const user = await repository.getUser(request.body);
    try {
      const compareResult = await hashPassword.compare(request.body.password, user[1].password);
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
