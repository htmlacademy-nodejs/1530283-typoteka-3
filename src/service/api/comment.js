'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const commentValidator = require(`./middlewares/comment-validator`);

const commentsRoutes = new Router({mergeParams: true});

module.exports = (app, commentService) => {
  app.use(`/:articleId/comments`, commentsRoutes);

  commentsRoutes.get(`/`, (req, res) => {
    const {articleId} = req.params;
    const comments = commentService.findAll(articleId);

    res.status(HttpCode.OK).json(comments);
  });

  commentsRoutes.post(`/`, commentValidator, (req, res) => {
    const {articleId} = req.params;
    const newComment = commentService.create(articleId, req.body);

    res.status(HttpCode.CREATED).json(newComment);
  });

  commentsRoutes.delete(`/:commentId`, (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;

    const comment = commentService.drop(article, commentId);

    if (!comment) {
      res.status(HttpCode.NOT_FOUND).send(`No comment with id = ${commentId}`);
      return;
    }

    res.status(HttpCode.NO_CONTENT).end();
  });
};
