'use strict';

const {nanoid} = require(`nanoid`);

const MAX_ID_LENGTH = 10;

const getImageId = () => nanoid(MAX_ID_LENGTH);

const getImageFileName = (file) => {
  const uniqueName = getImageId();
  const extension = file.originalname.split(`.`).pop();
  return `${uniqueName}.${extension}`;
};

module.exports = {
  getImageFileName
};
