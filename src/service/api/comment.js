"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentExists = require(`./middlewares/comment-exists`);

module.exports = (app, commentService) => {
  const commentsRoutes = new Router();

  app.use(`/comments`, commentsRoutes);

  commentsRoutes.get(`/`, async (req, res, next) => {
    try {
      const {limit} = req.query;

      const comments = await commentService.findAll({
        limit: limit ? Number(limit) : undefined,
      });

      res.status(HttpCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  commentsRoutes.use(`/:commentId`, commentExists(commentService));

  commentsRoutes.delete(`/:commentId`, async (req, res, next) => {
    try {
      await commentService.drop(Number(req.params.commentId));

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
