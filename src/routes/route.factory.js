const express = require('express');

module.exports = (repo) => {
  const router = express.Router();

  router.route('/')
    .get(list)
    .post(add);

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
