'use strict';

const {Router} = require(`express`);

const searchRoutes = new Router();

searchRoutes.get(`/`, async (req, res) => {
  res.send(`Get articles by query`);
});

module.exports = searchRoutes;
