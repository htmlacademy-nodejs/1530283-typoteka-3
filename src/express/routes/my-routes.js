"use strict";

const {Router} = require(`express`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getAPI} = require(`../api`);

const myRoutes = new Router();
const api = getAPI();

myRoutes.get(`/`, async (_req, res) => {
  try {
    const articles = await api.getArticles();

    res.render(`admin/articles`, {
      user: {
        isAdmin: true,
      },
      articles: articles.map(getArticleTemplateData),
    });
  } catch (error) {
    throw error;
  }
});

myRoutes.get(`/comments`, async (_req, res) => {
  try {
    const articles = await api.getArticles();
    const comments = articles.reduce(
        (acc, article) => acc.concat(article.comments),
        []
    );

    res.render(`admin/comments`, {
      user: {
        isAdmin: true,
      },
      comments,
    });
  } catch (error) {
    throw error;
  }
});

myRoutes.get(`/categories`, async (_req, res) => {
  try {
    const categories = await api.getCategories();

    res.render(`admin/categories`, {
      user: {
        isAdmin: true,
      },
      categories,
    });
  } catch (error) {
    throw error;
  }
});

module.exports = myRoutes;
