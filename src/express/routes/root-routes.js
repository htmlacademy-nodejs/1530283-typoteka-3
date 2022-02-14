'use strict';

const {Router} = require(`express`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getAPI} = require(`../api`);

const rootRoutes = new Router();
const api = getAPI();

rootRoutes.get(`/`, async (_req, res) => {
  try {
    const articles = await api.getArticles();
    res.render(`articles/all-articles`, {
      articles: articles.map(getArticleTemplateData)
    });
  } catch (error) {
    throw error;
  }
});

rootRoutes.get(`/register`, (req, res) => res.render(`auth/register`));

rootRoutes.get(`/login`, (req, res) => res.render(`auth/login`));

rootRoutes.get(`/search`, (req, res) => res.render(`articles/search`));

module.exports = rootRoutes;

