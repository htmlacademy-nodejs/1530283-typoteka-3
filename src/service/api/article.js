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
      const articles = await articleService.findAll();

      res.status(HttpCode.OK).json(articles);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.get(`/:articleId`, (req, res) => {
    const {article} = res.locals;

    res.status(HttpCode.OK).json(article);
  });

  articlesRoutes.post(`/`, articleValidator, (req, res) => {
    const newArticle = articleService.create(req.body);
    res.status(HttpCode.CREATED).json(newArticle);
  });

  articlesRoutes.put(`/:articleId`, articleValidator, (req, res) => {
    const {article} = res.locals;
    const updatedArticle = articleService.update(article, req.body);

    res.status(HttpCode.OK).json(updatedArticle);
  });

  articlesRoutes.delete(`/:articleId`, (req, res) => {
    const {article} = res.locals;
    articleService.drop(article.id);

    res.status(HttpCode.NO_CONTENT).end();
  });
};
