'use strict';

const {Router} = require(`express`);

const {HttpError} = require(`../../constants`);

const articlesRoutes = new Router();

articlesRoutes.get(`/404`, (_req, res) => res.render(`error`, {
  httpError: HttpError.CLIENT
}));

articlesRoutes.get(`/500`, (_req, res) => res.render(`error`, {
  httpError: HttpError.SERVER
}));

module.exports = articlesRoutes;
