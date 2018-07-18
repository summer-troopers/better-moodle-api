'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const hashPassword = require('../helpers/hash/hash-factory')();

module.exports = function createAuthenticationRoute(repository) {
  const router = express.Router();

  async function loginUser(request, response) {
    const result = await repository.returnUser(request.body);
    if (!result) return response.sendStatus(404);
    const token = jwt.sign(result, config.jwtconf.secret, config.jwtconf.time);
    return response.status(200).json({ token });
  }

  async function comparePassword(request, response, next) {
    const passwordDb = await repository.returnUser(request.body);
    hashPassword.compare(request.body.password, passwordDb.user.dataValues.password)
      .then((result) => {
        if (result) return next();
        return response.sendStatus(404);
      })
      .catch(console.error);
  }

  router.route('/')
    .post(comparePassword, loginUser);

  return router;
};
