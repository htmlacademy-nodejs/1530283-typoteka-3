'use strict';

const {Router} = require(`express`);

const categoriesRoutes = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, categoriesRoutes);

  categoriesRoutes.get(`/`, (req, res) => {
    const categories = categoryService.findAll();

    res.json(categories);
  });
};
