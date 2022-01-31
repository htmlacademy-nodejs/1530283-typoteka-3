'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const searchRoutes = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, (req, res) => {
    const {query: searchText} = req.query;
    const articles = searchService.findAll(searchText);

    res.status(HttpCode.OK).json(articles);
  });
};
