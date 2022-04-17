"use strict";

const {Router} = require(`express`);

const {HttpCode, SocketEvent} = require(`../../constants`);

const {commentValidator} = require(`../middlewares`);

const {getCommentTemplateData} = require(`../../utils/comment`);
const {getArticleTemplateData} = require(`../../utils/article`);

module.exports = (app, articleService, commentService) => {
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
      const articleId = Number(req.params.articleId);

      const {socket} = req.app.locals;

      const newComment = await commentService.create({
        ...req.body,
        articleId,
      });

      const [hotArticles, lastComments] = await Promise.all([
        articleService.findHotOnes(),
        commentService.findLastOnes(),
      ]);

      const isHotArticlesAffected = hotArticles.map((article) => article.id === articleId);

      if (isHotArticlesAffected) {
        socket.emit(SocketEvent.HOT_ARTICLES_UPDATE, hotArticles.map((article) =>
          getArticleTemplateData(article)
        ));
      }

      socket.emit(SocketEvent.LAST_COMMENTS_UPDATE, lastComments.map((comment) =>
        getCommentTemplateData(comment, {
          truncate: true,
        }),
      ));

      res.status(HttpCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });
};
