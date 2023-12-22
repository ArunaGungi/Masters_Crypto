// fileRoutes.js
const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/fileController');

const fileRouter = express.Router();

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
      },
    }),
  }).single('file');

console.log("file router called");

fileRouter.post('/upload', upload, fileController.upload);
fileRouter.get('/display', fileController.display);
fileRouter.delete('/delete/:id', fileController.delete);
fileRouter.get('/download/:filename', fileController.download);

module.exports = fileRouter;