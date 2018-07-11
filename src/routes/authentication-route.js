'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function createUserRoute(connection) {
  const repository = require('../services/repositories/user-repository')(connection); // eslint-disable-line global-require

  const router = express.Router();

  async function loginUser(request, response) {
    const result = await repository.returnUser(request.body);
    if (!result) return response.sendStatus(404);
    const token = jwt.sign(result, config.jwtconf.secret, config.jwtconf.time);
    return response.status(200).json({ token });
  }

  router.route('/')
    .post(loginUser);

  return router;
};
