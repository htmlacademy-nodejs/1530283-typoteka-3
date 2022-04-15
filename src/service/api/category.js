"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const instanceExists = require(`../middlewares/instance-exists`);
const categoryValidator = require(`../middlewares/category-validator`);

module.exports = (app, categoryService) => {
  const categoriesRoutes = new Router();

  app.use(`/categories`, categoriesRoutes);

  categoriesRoutes.get(`/`, async (req, res, next) => {
    try {
      const {withArticlesCount, havingArticles, articleId} = req.query;

      const categories = await categoryService.findAll({
        withArticlesCount: Boolean(withArticlesCount),
        havingArticles: Boolean(havingArticles),
        articleId: articleId ? Number(articleId) : undefined,
      });

      res.status(HttpCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  });

  categoriesRoutes.post(
      `/`,
      categoryValidator(categoryService),
      async (req, res, next) => {
        try {
          const newCategory = await categoryService.create(req.body);

          res.status(HttpCode.CREATED).json(newCategory);
        } catch (error) {
          next(error);
        }
      }
  );

  categoriesRoutes.use(`/:categoryId`, instanceExists(categoryService, `categoryId`));

  categoriesRoutes.put(
      `/:categoryId`,
      categoryValidator(categoryService),
      async (req, res, next) => {
        try {
          const updatedCategory = await categoryService.update(
              Number(req.params.categoryId),
              req.body
          );

          res.status(HttpCode.OK).json(updatedCategory);
        } catch (error) {
          next(error);
        }
      }
  );

  categoriesRoutes.delete(`/:categoryId`, async (req, res, next) => {
    try {
      await categoryService.drop(Number(req.params.categoryId));

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
