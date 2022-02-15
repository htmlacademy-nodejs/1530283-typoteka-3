"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {
  getArticleTemplateData,
  getInitialArticle,
} = require(`../../utils/article`);

const articlesRoutes = new Router();

const api = getAPI();

articlesRoutes.get(`/category/:id`, (req, res) =>
  res.render(`articles/articles-by-category`, {
    user: {},
  })
);

articlesRoutes.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories();

    res.render(`admin/form`, {
      user: {
        isAdmin: true,
      },
      article: getInitialArticle(),
      categories,
      isNew: true,
    });
  } catch (error) {
    throw error;
  }
});

articlesRoutes.post(`/add`, async (req, res) => {
  try {
    await api.createArticle(req.body);
    res.redirect(`/my`);
  } catch (error) {
    console.error(error);
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(req.params.id),
      api.getCategories(),
    ]);

    res.render(`admin/form`, {
      user: {
        isAdmin: true,
      },
      article,
      categories,
    });
  } catch (error) {
    throw error;
  }
});

articlesRoutes.get(`/:id`, async (req, res) => {
  try {
    const article = await api.getArticle(req.params.id);

    res.render(`articles/article`, {
      user: {},
      article: getArticleTemplateData(article),
    });
  } catch (error) {
    throw error;
  }
});

module.exports = articlesRoutes;
