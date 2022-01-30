"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const comment = require(`./comment`);
const articleValidator = require(`./middlewares/article-validator`);

const articlesRoutes = new Router();

const sendArticleNotFound = (res, articleId) =>
  res.status(HttpCode.NOT_FOUND).send(`No article with id = ${articleId}`);

module.exports = (app, articleService) => {
  app.use(`/articles`, articlesRoutes);

  comment(articlesRoutes);

  articlesRoutes.get(`/`, async (req, res) => {
    const articles = articleService.findAll();
    res.json(articles);
  });

  articlesRoutes.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (article) {
      res.status(HttpCode.OK).json(article);
      return;
    }

    sendArticleNotFound(res, articleId);
  });

  articlesRoutes.post(`/`, articleValidator, async (req, res) => {
    const newArticle = articleService.create(req.body);
    res.status(HttpCode.CREATED).json(newArticle);
  });

  articlesRoutes.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = articleService.update(articleId, req.body);

    if (article) {
      res.status(HttpCode.OK).json(article);
      return;
    }

    sendArticleNotFound(res, articleId);
  });

  articlesRoutes.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    if (article) {
      res.status(HttpCode.NO_CONTENT).end();
      return;
    }

    sendArticleNotFound(res, articleId);
  });
};
