'use strict';

const {Router} = require(`express`);

const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.render(`admin/articles`, {
  user: {
    isAdmin: true,
  }
}));

myRoutes.get(`/comments`, (req, res) => res.render(`admin/comments`, {
  user: {
    isAdmin: true,
  }
}));

myRoutes.get(`/categories`, (req, res) => res.render(`admin/categories`, {
  user: {
    isAdmin: true,
  }
}));

module.exports = myRoutes;
