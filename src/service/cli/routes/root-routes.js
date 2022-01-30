'use strict';

const {Router} = require(`express`);

// const {readFile} = require(`../../../utils`);
// const {FilePath, FileType} = require(`../../../constants`);

const rootRoutes = new Router();

rootRoutes.get(`/categories`, async (req, res) => {
  res.send(`Get categories`);
});

rootRoutes.get(`/search`, async (req, res) => {
  res.send(`Get articles by query`);
});

module.exports = rootRoutes;
