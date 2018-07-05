'use strict';

const express = require('express');

module.exports = function createRoute(repo) {
  const router = express.Router();

  router.route('/')
    .get(list) // eslint-disable-line no-use-before-define
    .post(add); // eslint-disable-line no-use-before-define

  async function list(req, res) {
    const result = await repo.list();
    res.json(result);
  }

  async function add(req, res) {
    const result = await repo.add(req.body);
    res.json(result);
  }

  return router;
};
