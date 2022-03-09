"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, commentService) => {
  const commentsRoutes = new Router();

  app.use(`/comments`, commentsRoutes);

  commentsRoutes.get(`/`, async (_req, res, next) => {
    try {
      const comments = await commentService.findAll();

      res.status(HttpCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });
};
