'use strict';

const {Router} = require(`express`);
const {sendPath} = require(`../../utils`);

const rootRoutes = new Router();

rootRoutes.get(`/`, sendPath);

rootRoutes.get(`/register`, sendPath);

rootRoutes.get(`/login`, sendPath);

rootRoutes.get(`/search`, sendPath);

module.exports = rootRoutes;

