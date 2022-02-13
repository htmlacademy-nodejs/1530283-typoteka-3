'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, categoryService) => {
  const categoriesRoutes = new Router();

  app.use(`/categories`, categoriesRoutes);

  categoriesRoutes.get(`/`, (req, res) => {
    const categories = categoryService.findAll();

    res.status(HttpCode.OK).json(categories);
  });
};
