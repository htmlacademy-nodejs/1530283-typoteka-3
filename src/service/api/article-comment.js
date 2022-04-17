"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit, SocketEvent} = require(`../../constants`);

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

      const newComment = await commentService.create({
        ...req.body,
        articleId,
      });

      // todo: get most commented articles after comment creation. DONE
      // todo: get latest comments after comment creation. DONE
      const [hotArticles, lastComments] = await Promise.all([
        articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.HOT_ARTICLES_SECTION,
        }),
        commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        }),
      ]);

      const {socket} = req.app.locals;

      const isHotArticlesAffected = hotArticles.rows.map((article) => article.id === articleId);

      // todo: if most articleId in most commented articles emit `most-commented:update`. DONE
      if (isHotArticlesAffected) {
        socket.emit(SocketEvent.HOT_ARTICLES_UPDATE, hotArticles.rows.map((article) =>
          getArticleTemplateData(article)
        ));
      }

      // todo: anyway emit `latest-comments:update`. DONE
      socket.emit(SocketEvent.LAST_COMMENTS_UPDATE, lastComments.map((comment) =>
        getCommentTemplateData(comment, {
          truncate: true
        }),
      ));

      res.status(HttpCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });
};
