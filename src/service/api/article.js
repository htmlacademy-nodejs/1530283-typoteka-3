"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const articleComment = require(`./article-comment`);

const {articleValidator, instanceExists, routeParamsValidator} = require(`../middlewares`);

module.exports = (app, articleService, commentService, categoryService) => {
  const articlesRoutes = new Router();

  app.use(`/articles`, articlesRoutes);

  articlesRoutes.use(`/:articleId`, routeParamsValidator, instanceExists(articleService, `articleId`));

  articleComment(articlesRoutes, articleService, commentService);

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
      const articleId = Number(req.params.articleId);
      // todo: get latest comments before article deletion
      // todo: get most commented before article deletion

      await articleService.drop(articleId);

      // todo: if latest comments before deletion had comments with articleId - get new latest comments and emit `latest-comments:update`
      // todo: if most commented before deletion had articleId - get new most commented and emit `most-commented:update`

      req.app.locals.socket.emit(`article:delete`, res.locals.articleIdInstance);

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
