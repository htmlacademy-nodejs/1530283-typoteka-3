"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getAPI} = require(`../api`);

const rootRoutes = new Router();
const api = getAPI();

rootRoutes.get(`/`, async (_req, res, next) => {
  try {
    const [articles, categories, mostCommentedArticles] = await Promise.all([
      api.getArticles(),
      api.getCategories({withArticlesCount: true, havingArticles: true}),
      api.getArticles({limit: 4, mostCommented: true}),
    ]);

    console.log(mostCommentedArticles);

    res.render(`articles/all-articles`, {
      articles: articles.map(getArticleTemplateData),
      categories,
      mostCommentedArticles: mostCommentedArticles.map(getArticleTemplateData),
    });
  } catch (error) {
    next(error);
  }
});

rootRoutes.get(`/register`, (_req, res) => res.render(`auth/register`));

rootRoutes.get(`/login`, (_req, res) => res.render(`auth/login`));

rootRoutes.get(`/search`, async (req, res, next) => {
  const {query} = req.query;

  try {
    const articles = await api.search(query);

    res.render(`articles/search`, {
      articles: articles.map(getArticleTemplateData),
      query
    });
  } catch (error) {
    if (!error.response) {
      next(error);
      return;
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

    next(error);
  }
});

module.exports = rootRoutes;
