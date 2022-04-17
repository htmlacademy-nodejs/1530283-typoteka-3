"use strict";

const {Router} = require(`express`);

const {HttpCode, SocketEvent} = require(`../../constants`);

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
      const commentId = Number(req.params.commentId);
      const articleId = res.locals.commentIdInstance.articleId;

      const {socket} = req.app.locals;

      const [hotArticles, lastComments] = await Promise.all([
        articleService.findHotOnes(),
        commentService.findLastOnes(),
      ]);

      const isHotArticlesAffected = hotArticles.some((article) => article.id === articleId);
      const isLastCommentsAffected = lastComments.some((comment) => comment.id === commentId);

      await commentService.drop(commentId);

      if (isHotArticlesAffected) {
        const hotArticlesUpdated = await articleService.findHotOnes();

        socket.emit(SocketEvent.HOT_ARTICLES_UPDATE, hotArticlesUpdated.map((article) =>
          getArticleTemplateData(article, {
            truncate: true,
          }),
        ));
      }

      if (isLastCommentsAffected) {
        const updatedLastComments = await commentService.findLastOnes();

        socket.emit(SocketEvent.LAST_COMMENTS_UPDATE, updatedLastComments.map((comment) =>
          getCommentTemplateData(comment, {
            truncate: true,
          }),
        ));
      }

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
