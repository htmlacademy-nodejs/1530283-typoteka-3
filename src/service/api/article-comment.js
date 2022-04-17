"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit, SocketEvent} = require(`../../constants`);

const {commentValidator} = require(`../middlewares`);

const {getCommentTemplateData} = require(`../../utils/comment`);

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
      const [mostCommented, lastComments] = await Promise.all([
        articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.MOST_COMMENTED_SECTION,
        }),
        commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        }),
      ]);

      const {socket} = req.app.locals;

      // todo: if most articleId in most commented articles emit `most-commented:update`
      socket.emit(SocketEvent.MOST_COMMENTED_UPDATE, mostCommented);

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
