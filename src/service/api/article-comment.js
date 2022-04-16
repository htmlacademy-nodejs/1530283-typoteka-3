"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {commentValidator} = require(`../middlewares`);

module.exports = (app, commentService) => {
  const articleCommentsRoutes = new Router({mergeParams: true});

  app.use(`/:articleId/comments`, articleCommentsRoutes);

  articleCommentsRoutes.get(`/`, async (req, res, next) => {
    try {
      const {articleId} = req.params;

      const comments = await commentService.findAll({
        articleId: articleId ? Number(articleId) : undefined,
      });

      res.status(HttpCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  articleCommentsRoutes.post(`/`, commentValidator, async (req, res, next) => {
    try {
      const {articleId} = req.params;

      const newComment = await commentService.create({
        ...req.body,
        articleId: Number(articleId),
      });

      res.status(HttpCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });
};
