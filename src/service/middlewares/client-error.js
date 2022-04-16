"use strict";

const {HttpCode} = require(`../../constants`);

const NOT_FOUND_MESSAGE = `Not found`;

const clientError = () => (_req, res) => {
  res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_MESSAGE);
};

module.exports = clientError;
