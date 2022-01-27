'use strict';

const {Router} = require(`express`);
const {Error} = require(`../../constants`);

const articlesRoutes = new Router();

articlesRoutes.get(`/404`, (req, res) => res.render(`error`, {
  error: Error.CLIENT
}));

articlesRoutes.get(`/500`, (req, res) => res.render(`error`, {
  error: Error.SERVER
}));

module.exports = articlesRoutes;
