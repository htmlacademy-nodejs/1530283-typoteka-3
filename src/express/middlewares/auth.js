"use strict";

const {HttpMethod, HttpCode} = require(`../../constants`);

const auth = () => (req, res, next) => {
  if (req.session.user) {
    next();
    return;
  }

  if (req.method === HttpMethod.GET) {
    res.redirect(`/login`);
    return;
  }

  res.statusCode(HttpCode.FORBIDDEN).end();
};

module.exports = auth;
