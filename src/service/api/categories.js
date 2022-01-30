'use strict';

const {Router} = require(`express`);

const categoriesRoutes = new Router();

categoriesRoutes.get(`/`, async (req, res) => {
  res.send(`Get categories`);
});

module.exports = categoriesRoutes;
