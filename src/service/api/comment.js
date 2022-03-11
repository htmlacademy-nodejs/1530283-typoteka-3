"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, commentService) => {
  const commentsRoutes = new Router();

  app.use(`/comments`, commentsRoutes);

  commentsRoutes.get(`/`, async (req, res, next) => {
    try {
      const comments = await commentService.findAll(req.query);

      res.status(HttpCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });
};
