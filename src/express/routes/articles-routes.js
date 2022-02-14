'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const articlesRoutes = new Router();

const api = getAPI();

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`, {
  user: {},
}));

articlesRoutes.get(`/add`, (req, res) => res.render(`admin/form`, {
  user: {
    isAdmin: true,
  }
}));

articlesRoutes.get(`/edit/:id`, (req, res) => res.render(`admin/form`, {
  user: {
    isAdmin: true,
  }
}));

articlesRoutes.get(`/:id`, async (req, res) => {
  try {
    const article = await api.getArticle(req.params.id);

    res.render(`articles/article`, {
      user: {},
      article
    });
  } catch (error) {
    throw error;
  }
});

module.exports = articlesRoutes;

