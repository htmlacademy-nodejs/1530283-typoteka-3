"use strict";

const {HttpMethod, HttpCode} = require(`../../constants`);

const guest = (req, res, next) => {
  if (!req.session.user) {
    next();
    return;
  }

  if (req.method === HttpMethod.GET) {
    res.redirect(`/`);
    return;
  }

  res.statusCode(HttpCode.FORBIDDEN).end();
};

module.exports = guest;
