'use strict';

const {Router} = require(`express`);

const categoriesRoutes = new Router();

module.exports = (app) => {
  app.use(`/categories`, categoriesRoutes);

  categoriesRoutes.get(`/`, async (req, res) => {
    res.send(`Get categories`);
  });
};
