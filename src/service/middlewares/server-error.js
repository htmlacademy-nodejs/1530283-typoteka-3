"use strict";

const {HttpCode} = require(`../../constants`);

const SERVER_ERROR_MESSAGE = `Internal server error`;

const serverError = () => (_err, _req, res, _next) => {
  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(SERVER_ERROR_MESSAGE);
};

module.exports = serverError;
