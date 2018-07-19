const config = require('config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const express = require('express');
const errors = require('@feathersjs/errors');

const storage = new GridFsStorage({
  url: config.mongo,
  connectionOpts: { useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileName = Date.now() + file.originalname;

      const fileInfo = {
        filename: fileName,
        bucket: 'uploads',
      };
      return resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

module.exports = function createLabsRoute(repository, createPermissions) {
  const router = express.Router();

  router.route('/')
    .get(list)
    .post(upload.single('lab'), add);

  router.route('/:filename')
    .get(view);

  router.route('/:id')
    .delete(remove);

  return router;

  function add(request, response) {
    if (!createPermissions[request.token.role].create) response.json(new errors.Forbidden());
    else if (!request.file) {
      response.status(400).json({ err: 'File not received.' });
    } else response.json({ succes: 'File added' });
  }

  async function list(request, response) {
    if (!createPermissions[request.token.role].read) response.json(new errors.Forbidden());
    else {
      const resultFiles = await repository.list();
      if (!resultFiles || resultFiles.length === 0) {
        response.status(404).json({ err: 'File not found.' });
      } else response.json(resultFiles);
    }
  }

  async function view(request, response) {
    if (!createPermissions[request.token.role].read) response.json(new errors.Forbidden());
    else {
      const resultFile = await repository.view(request.params.filename);
      if (!resultFile || resultFile.length === 0) {
        response.status(404).json({ err: 'No such file exists.' });
      } else response.json(resultFile);
    }
  }

  async function remove(request, response) {
    if (!createPermissions[request.token.role].delete) response.json(new errors.Forbidden());
    else {
      const deleteResult = await repository.remove(request.params.id);
      response.json(deleteResult);
    }
  }
};
