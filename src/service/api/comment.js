"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit, SocketEvent} = require(`../../constants`);

const {instanceExists, routeParamsValidator} = require(`../middlewares`);

const {getCommentTemplateData} = require(`../../utils/comment`);

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
      // todo: get articleId from locals. DONE
      const commentId = Number(req.params.commentId);
      const articleId = res.locals.commentIdInstance.articleId;

      // todo: get last comments before comment deletion. DONE
      // todo: get most commented before comment deletion. DONE
      const [mostCommented, lastComments] = await Promise.all([
        articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.MOST_COMMENTED_SECTION,
        }),
        commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        }),
      ]);

      await commentService.drop(commentId);

      const {socket} = req.app.locals;

      const isLastCommentsAffected = lastComments.some((comment) => comment.id === commentId);

      // todo: if latest comments before deletion had commentIdInstance - get new latest comments and emit `latest-comments:update`. DONE
      if (isLastCommentsAffected) {
        const updatedLastComments = await commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        });

        socket.emit(SocketEvent.LAST_COMMENTS_UPDATE, updatedLastComments.map((comment) =>
          getCommentTemplateData(comment, {
            truncate: true
          }),
        ));
      }

      // todo: if most commented before deletion had articleId - get new most commented and emit `most-commented:update`

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
