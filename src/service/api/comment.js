"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit, SocketEvent} = require(`../../constants`);

const {instanceExists, routeParamsValidator} = require(`../middlewares`);

const {getCommentTemplateData} = require(`../../utils/comment`);
const {getArticleTemplateData} = require(`../../utils/article`);

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
      const [hotArticles, lastComments] = await Promise.all([
        articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.HOT_ARTICLES_SECTION,
        }),
        commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        }),
      ]);

      await commentService.drop(commentId);

      const {socket} = req.app.locals;

      const isLastCommentsAffected = lastComments.some((comment) => comment.id === commentId);
      const isHotArticlesAffected = hotArticles.rows.some((article) => article.id === articleId);

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

      // todo: if most commented before deletion had articleId - get new most commented and emit `most-commented:update`. DONE
      if (isHotArticlesAffected) {
        const hotArticlesUpdated = await articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.HOT_ARTICLES_SECTION,
        });

        socket.emit(SocketEvent.HOT_ARTICLES_UPDATE, hotArticlesUpdated.rows.map((article) =>
          getArticleTemplateData(article, {
            truncate: true
          }),
        ));
      }

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
