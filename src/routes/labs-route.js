const config = require('config');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');
const express = require('express');

const storage = new GridFsStorage({
  url: config.mongo,
  connectionOpts: { useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const fileName = buf.toString('hex') + path.extname(file.originalname);

        const fileInfo = {
          filename: fileName,
          bucket: 'uploads',
        };
        return resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

module.exports = function createLabsRoute(repository) {
  const router = express.Router();

  router.route('/')
    .get(list)
    .post(upload.single('lab'), add);

  router.route('/:filename')
    .get(view);

  router.route('/:id')
    .delete(remove);

  return router;

  function add(req, res) {
    if (!req.file) {
      res.status(400).json({ err: 'File not recived ' });
    } else res.json({ succes: 'File added' });
  }

  async function list(req, res) {
    const resultFiles = await repository.list();
    if (!resultFiles || resultFiles.length === 0) {
      res.status(404).json({ err: 'File not found' });
    } else res.json(resultFiles);
  }

  async function view(req, res) {
    const resultFile = await repository.view(req.params.filename);
    if (!resultFile || resultFile.length === 0) {
      res.status(404).json({ err: 'No file exists' });
    } else res.json(resultFile);
  }

  async function remove(req, res) {
    const deleteResult = await repository.remove(req.params.id);
    res.json(deleteResult);
  }
};
