"use strict";

const multer = require(`multer`);
const path = require(`path`);

const {getImageFileName} = require(`../../utils/image`);

const UPLOAD_DIR = `../upload/img`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const ALLOWED_MIME_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];

const NO_ERROR = null;

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, callback) => {
    const fileName = getImageFileName(file);
    callback(NO_ERROR, fileName);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(NO_ERROR, true);
    return;
  }

  cb(NO_ERROR, false);
};

const upload = multer({storage, fileFilter});

module.exports = upload;
