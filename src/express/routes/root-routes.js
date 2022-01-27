'use strict';

const {Router} = require(`express`);

const rootRoutes = new Router();

rootRoutes.get(`/`, (req, res) => res.render(`main`));

rootRoutes.get(`/register`, (req, res) => res.render(`register`));

rootRoutes.get(`/login`, (req, res) => res.render(`login`));

rootRoutes.get(`/search`, (req, res) => res.render(`search`));

module.exports = rootRoutes;

