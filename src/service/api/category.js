'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, categoryService) => {
  const categoriesRoutes = new Router();

  app.use(`/categories`, categoriesRoutes);

  categoriesRoutes.get(`/`, async (req, res, next) => {
    try {
      const categories = await categoryService.findAll(req.query);

      res.status(HttpCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  });
};
