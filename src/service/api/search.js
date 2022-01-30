'use strict';

const {Router} = require(`express`);

const searchRoutes = new Router();

module.exports = (app) => {
  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, async (req, res) => {
    res.send(`Get articles by query`);
  });
};
