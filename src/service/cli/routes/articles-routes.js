'use strict';

const {Router} = require(`express`);

const {readFile} = require(`../../../utils`);
const {FilePath, FileType} = require(`../../../constants`);

const articlesRoutes = new Router();

articlesRoutes.get(`/`, async (req, res) => {
  const articles = await readFile(FilePath.MOCKS, FileType.JSON);
  res.json(articles);
});

module.exports = articlesRoutes;
