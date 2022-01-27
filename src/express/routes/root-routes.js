'use strict';

const {Router} = require(`express`);

const rootRoutes = new Router();

rootRoutes.get(`/`, (req, res) => res.render(`articles/all-articles`));

rootRoutes.get(`/register`, (req, res) => res.render(`auth/register`));

rootRoutes.get(`/login`, (req, res) => res.render(`auth/login`));

rootRoutes.get(`/search`, (req, res) => res.render(`articles/search`));

module.exports = rootRoutes;

