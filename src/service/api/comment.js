'use strict';

const {Router} = require(`express`);

const commentsRoutes = new Router();

module.exports = (app) => {
  app.use(`/:articleId/comments`, commentsRoutes);

  commentsRoutes.get(`/`, async (req, res) => {
    res.send(`Get article comments`);
  });

  commentsRoutes.post(`/`, async (req, res) => {
    res.send(`Create new comment to article`);
  });

  commentsRoutes.delete(`/:commentId`, async (req, res) => {
    res.send(`Delete comment with id from article`);
  });
};
