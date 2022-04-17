"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const {commentValidator} = require(`../middlewares`);

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

      // todo: get most commented articles
      // todo: get latest comments
      // const [mostCommented, latestComments] = await Promise.all([
      //   articleService.findAndCountAll({
      //     mostCommented: true,
      //     limit: 4, // todo: create common constant value
      //   }),
      //   commentService.findAll({
      //     limit: 4, // todo: create common constant value
      //   }),
      // ]);

      // todo: if most articleId in most commented articles emit `most-commented:update`
      // todo: anyway emit `latest-comments:update`

      req.app.locals.socket.emit(`comment:create`, newComment);

      res.status(HttpCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });
};
