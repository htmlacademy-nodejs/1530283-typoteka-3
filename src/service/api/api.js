'use strict';

const {Router} = require(`express`);

const categoriesRoutes = require(`./categories`);
const articlesRoutes = require(`./articles`);
const searchRoutes = require(`./search`);

const apiRoutes = new Router();

apiRoutes.use(`/articles`, articlesRoutes);

apiRoutes.use(`/categories`, categoriesRoutes);

apiRoutes.use(`/search`, searchRoutes);

module.exports = apiRoutes;
