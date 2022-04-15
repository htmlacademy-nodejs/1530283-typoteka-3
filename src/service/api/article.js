"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleComment = require(`./article-comment`);
const articleValidator = require(`../middlewares/article-validator`);
const instanceExists = require(`../middlewares/instance-exists`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService, categoryService) => {
  const articlesRoutes = new Router();

  app.use(`/articles`, articlesRoutes);

  articlesRoutes.use(`/:articleId`, routeParamsValidator, instanceExists(articleService, `articleId`));

  articleComment(articlesRoutes, commentService);

  articlesRoutes.get(`/`, async (req, res, next) => {
    try {
      const {limit, offset, mostCommented, withCategories, categoryId} = req.query;

      const articles = await articleService.findAndCountAll({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        mostCommented: Boolean(mostCommented),
        withCategories: Boolean(withCategories),
        categoryId: categoryId ? Number(categoryId) : undefined,
      });

      res.status(HttpCode.OK).json(articles);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.get(`/:articleId`, async (req, res, next) => {
    try {
      const article = await articleService.findOne(req.params.articleId);

      res.status(HttpCode.OK).json(article);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.post(`/`, articleValidator(categoryService), async (req, res, next) => {
    try {
      const newArticle = await articleService.create(req.body);

      res.status(HttpCode.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.put(
      `/:articleId`,
      articleValidator(categoryService),
      async (req, res, next) => {
        try {
          const updatedArticle = await articleService.update(
              Number(req.params.articleId),
              req.body
          );

          res.status(HttpCode.OK).json(updatedArticle);
        } catch (error) {
          next(error);
        }
      }
  );

  articlesRoutes.delete(`/:articleId`, async (req, res, next) => {
    try {
      await articleService.drop(Number(req.params.articleId));

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
