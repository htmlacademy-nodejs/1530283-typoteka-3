"use strict";

const {HttpMethod, HttpCode} = require(`../../constants`);

const admin = () => (req, res, next) => {
  const {user} = req.session;

  if (user && user.isAdmin) {
    next();
    return;
  }

  if (req.method === HttpMethod.GET) {
    res.redirect(`/404`);
    return;
  }

  res.statusCode(HttpCode.FORBIDDEN).end();
};

module.exports = admin;
