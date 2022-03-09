"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentValidator = require(`./middlewares/comment-validator`);

module.exports = (app, commentService) => {
  const articleCommentsRoutes = new Router({mergeParams: true});

  app.use(`/:articleId/comments`, articleCommentsRoutes);

  articleCommentsRoutes.get(`/`, async (req, res, next) => {
    try {
      const {articleId} = req.params;
      const comments = await commentService.findAll(articleId);

      res.status(HttpCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  articleCommentsRoutes.post(`/`, commentValidator, (req, res) => {
    const {articleId} = req.params;
    const newComment = commentService.create(articleId, req.body);

    res.status(HttpCode.CREATED).json(newComment);
  });

  articleCommentsRoutes.delete(`/:commentId`, (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    const comment = commentService.drop(article, commentId);

    if (!comment) {
      res.status(HttpCode.NOT_FOUND).send(`No comment with id = ${commentId}`);
      return;
    }

    res.status(HttpCode.NO_CONTENT).end();
  });
};
