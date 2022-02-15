"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getAPI} = require(`../api`);

const rootRoutes = new Router();
const api = getAPI();

rootRoutes.get(`/`, async (_req, res) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles(),
      api.getCategories(),
    ]);

    res.render(`articles/all-articles`, {
      articles: articles.map(getArticleTemplateData),
      categories,
    });
  } catch (error) {
    throw error;
  }
});

rootRoutes.get(`/register`, (req, res) => res.render(`auth/register`));

rootRoutes.get(`/login`, (req, res) => res.render(`auth/login`));

rootRoutes.get(`/search`, async (req, res) => {
  const {query} = req.query;

  try {
    const articles = await api.search(query);

    res.render(`articles/search`, {
      articles: articles.map(getArticleTemplateData),
      query
    });
  } catch (error) {
    if (!error.response) {
      throw error;
    }

    if (error.response.status === HttpCode.BAD_REQUEST) {
      res.render(`articles/search`, {
        articles: null,
        query
      });
      return;
    }

    if (error.response.status === HttpCode.NOT_FOUND) {
      res.render(`articles/search`, {
        articles: [],
        query
      });
      return;
    }

    throw error;
  }
});

module.exports = rootRoutes;
