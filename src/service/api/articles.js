'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);

const commentsRoutes = require(`./comments`);

const articlesRoutes = new Router();

articlesRoutes.use(`/:articleId/comments`, commentsRoutes);

articlesRoutes.get(`/`, async (req, res) => {
  const articles = await getMockData();
  res.json(articles);
});

articlesRoutes.get(`/:articleId`, async (req, res) => {
  res.send(`Get article by id`);
});

articlesRoutes.post(`/`, async (req, res) => {
  res.send(`Create new article`);
});

articlesRoutes.put(`/:articleId`, async (req, res) => {
  res.send(`Update article with id`);
});

articlesRoutes.delete(`/:articleId`, async (req, res) => {
  res.send(`Delete article by id`);
});

module.exports = articlesRoutes;
