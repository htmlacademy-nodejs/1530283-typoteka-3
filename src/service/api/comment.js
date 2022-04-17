"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const {instanceExists, routeParamsValidator} = require(`../middlewares`);

module.exports = (app, articleService, commentService) => {
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

  commentsRoutes.use(`/:commentId`, routeParamsValidator, instanceExists(commentService, `commentId`));

  commentsRoutes.delete(`/:commentId`, async (req, res, next) => {
    try {
      // todo: get articleId from locals
      // todo: get latest comments before comment deletion
      // todo: get most commented before comment deletion

      const commentId = Number(req.params.commentId);
      await commentService.drop(commentId);

      // todo: if latest comments before deletion had commentIdInstance - get new latest comments and emit `latest-comments:update`
      // todo: if most commented before deletion had articleId - get new most commented and emit `most-commented:update`

      req.app.locals.socket.emit(`comment:delete`, res.locals.commentIdInstance);

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
