'use strict';

const {Router} = require(`express`);
const {sendPath} = require(`../../utils`);

const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, sendPath);

articlesRoutes.get(`/add`, sendPath);

articlesRoutes.get(`/edit/:id`, sendPath);

articlesRoutes.get(`/:id`, sendPath);

module.exports = articlesRoutes;

