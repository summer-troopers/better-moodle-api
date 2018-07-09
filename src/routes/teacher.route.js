'use strict';

const express = require('express');
const getTeacherRepo = require('../services/repositories/teacher.repo');

module.exports = function createTeacherRoute(connection) {
  const repo = getTeacherRepo(connection); // eslint-disable-line global-require

  const router = express.Router();

  router.route('/')
    .get(list)
    .post(add);

  router.route('/:id')
    .get(view)
    .put(update)
    .delete(remove);

  async function list(req, res) {
    const result = await repo.list();
    res.json(result);
  }

  async function view(req, res) {
    const result = await repo.view(req.params.id);
    if (result.error !== undefined) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  }

  async function add(req, res) {
    const result = await repo.add(req.body);
    res.json(result);
  }

  async function remove(req, res) {
    const result = await repo.remove(req.params.id);
    if (result.error !== undefined) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  }

  async function update(req, res) {
    const result = await repo.update(req.params.id, req.body);
    if (result.error !== undefined) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  }

  return router;
};
