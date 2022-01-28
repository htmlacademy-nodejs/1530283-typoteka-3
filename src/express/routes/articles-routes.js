'use strict';

const {Router} = require(`express`);

const articlesRoutes = new Router();

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

articlesRoutes.get(`/:id`, (req, res) => res.render(`articles/article`, {
  user: {},
}));

module.exports = articlesRoutes;

