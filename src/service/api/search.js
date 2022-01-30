'use strict';

const {Router} = require(`express`);

const searchRoutes = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, (req, res) => {
    const {query: searchText} = req.query;
    const articles = searchService.findAll(searchText);

    res.json(articles);
  });
};
