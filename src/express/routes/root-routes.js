'use strict';

const {Router} = require(`express`);
const {sendPath} = require(`../../utils`);

const rootRoutes = new Router();

rootRoutes.get(`/`, (req, res) => res.render(`main`));

rootRoutes.get(`/register`, sendPath);

rootRoutes.get(`/login`, sendPath);

rootRoutes.get(`/search`, sendPath);

module.exports = rootRoutes;

