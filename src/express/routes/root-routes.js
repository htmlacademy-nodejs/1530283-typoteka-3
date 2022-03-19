"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const {getAPI} = require(`../api`);

const rootRoutes = new Router();
const api = getAPI();

const MOST_COMMENTED_ARTICLES_LIMIT = 4;
const LATEST_COMMENTS_LIMIT = 4;

rootRoutes.get(`/`, async (_req, res, next) => {
  try {
    const [articles, categories, mostCommentedArticles, latestComments] =
      await Promise.all([
        api.getArticles({withCategories: true}),
        api.getCategories({withArticlesCount: true, havingArticles: true}),
        api.getArticles({limit: MOST_COMMENTED_ARTICLES_LIMIT, mostCommented: true}),
        api.getComments({limit: LATEST_COMMENTS_LIMIT}),
      ]);

    res.render(`articles/all-articles`, {
      articles: articles.map(getArticleTemplateData),
      categories,
      mostCommentedArticles: mostCommentedArticles.map(getArticleTemplateData),
      latestComments: latestComments.map(getCommentTemplateData),
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

    console.log(articles);

    res.render(`articles/search`, {
      articles: articles.map(getArticleTemplateData),
      query,
    });
  } catch (error) {
    if (!error.response) {
      next(error);
      return;
    }

    if (error.response.status === HttpCode.BAD_REQUEST) {
      res.render(`articles/search`, {
        articles: null,
        query,
      });
      return;
    }

    if (error.response.status === HttpCode.NOT_FOUND) {
      res.render(`articles/search`, {
        articles: [],
        query,
      });
      return;
    }

    next(error);
  }
});

module.exports = rootRoutes;
