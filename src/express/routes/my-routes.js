'use strict';

const {Router} = require(`express`);

const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.render(`admin-articles`));

myRoutes.get(`/comments`, (req, res) => res.render(`admin-comments`));

myRoutes.get(`/categories`, (req, res) => res.render(`admin-categories`));

module.exports = myRoutes;
