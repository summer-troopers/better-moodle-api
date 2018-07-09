'use strict';

const express = require('express');

module.exports = function createAdminRoute(connection) {
  const repo = require('../services/repositories/admin.repo')(connection); // eslint-disable-line global-require
  const router = express.Router();

  router.route('/')
    .get(list);

  async function list(req, res) {
    const result = await repo.list();
    res.json(result);
  }

  return router;
};
