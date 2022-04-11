"use strict";

const {HttpCode, HttpMethod} = require(`../../constants`);

const clientError = (req, res) => {
  if (req.method !== HttpMethod.GET) {
    res.status(HttpCode.NOT_FOUND).end();
    return;
  }

  res.redirect(`/404`);
};

module.exports = clientError;
