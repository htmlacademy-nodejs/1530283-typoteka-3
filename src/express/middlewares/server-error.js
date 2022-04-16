"use strict";

const chalk = require(`chalk`);
const {HttpCode} = require(`../../constants`);
const clientError = require(`./client-error`);

const serverError = () => (err, req, res, _next) => {
  if (err.response && err.response.status === HttpCode.NOT_FOUND) {
    clientError()(req, res);
    return;
  }

  console.error(chalk.red(`Request failed with error: ${err.message}`));
  res.redirect(`/500`);
};

module.exports = serverError;
