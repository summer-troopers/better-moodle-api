const express = require('express');

module.exports = (repo) => {
  const router = express.Router();

  router.route('/')
    .get(list);

  async function list(req, res) {
    const result = await repo.list();
    res.json(result);
  }

  return router;
};
