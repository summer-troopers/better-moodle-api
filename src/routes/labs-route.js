const config = require('config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const express = require('express');
const errors = require('@feathersjs/errors');

const storage = new GridFsStorage({
  url: config.mongo,
  connectionOpts: { useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileName = Date.now() + path.extname(file.originalname);

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

  function add(request, result) {
    // if (!createPermissions[request.token.role].read) res.json(new errors.Forbidden());
    // else if (!request.file) {
    //   result.status(400).json({ err: 'File not received.' });
    // } else result.json({ succes: 'File added' });

    if (!request.file) {
      result.status(400).json({ err: 'File not received.' });
    } else result.json({ succes: 'File added' });
  }

  async function list(request, res) {
    // if (!createPermissions[request.token.role].read) result.json(new errors.Forbidden());
    // else {
    //   const resultFiles = await repository.list();
    //   if (!resultFiles || resultFiles.length === 0) {
    //     result.status(404).json({ err: 'File not found.' });
    //   } else result.json(resultFiles);
    // }

    const resultFiles = await repository.list();
    if (!resultFiles || resultFiles.length === 0) {
      result.status(404).json({ err: 'File not found.' });
    } else result.json(resultFiles);
  }

  async function view(request, result) {
    // if (!createPermissions[request.token.role].read) result.json(new errors.Forbidden());
    // else {
    //   const resultFile = await repository.view(request.params.filename);
    //   if (!resultFile || resultFile.length === 0) {
    //     result.status(404).json({ err: 'No such file exists.' });
    //   } else result.json(resultFile);
    // }
    const resultFile = await repository.view(request.params.filename);
    if (!resultFile || resultFile.length === 0) {
      result.status(404).json({ err: 'No such file exists.' });
    } else result.json(resultFile);
  }

  async function remove(request, result) {
    // if (!createPermissions[request.token.role].read) result.json(new errors.Forbidden());
    // else {
    //   const deleteResult = await repository.remove(request.params.id);
    //   result.json(deleteResult);
    // }
    const deleteResult = await repository.remove(request.params.id);
    result.json(deleteResult);
  }
};
