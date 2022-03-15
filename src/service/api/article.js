"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleComment = require(`./article-comment`);
const articleValidator = require(`./middlewares/article-validator`);
const articleExists = require(`./middlewares/article-exists`);


module.exports = (app, articleService, commentService) => {
  const articlesRoutes = new Router();

  app.use(`/articles`, articlesRoutes);

  articlesRoutes.use(`/:articleId`, articleExists(articleService));

  articleComment(articlesRoutes, commentService);

  articlesRoutes.get(`/`, async (req, res, next) => {
    try {
      const articles = await articleService.findAll(req.query);

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

  articlesRoutes.post(`/`, articleValidator, async (req, res, next) => {
    try {
      const newArticle = await articleService.create(req.body);

      res.status(HttpCode.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.put(`/:articleId`, articleValidator, async (req, res, next) => {
    try {
      const updatedArticle = await articleService.update(Number(req.params.articleId), req.body);

      res.status(HttpCode.OK).json(updatedArticle);
    } catch (error) {
      next(next);
    }
  });

  articlesRoutes.delete(`/:articleId`, async (req, res, next) => {
    try {
      await articleService.drop(Number(req.params.articleId));

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
