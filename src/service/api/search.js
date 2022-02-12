'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);


module.exports = (app, searchService) => {
  const searchRoutes = new Router();

  app.use(`/search`, searchRoutes);

  searchRoutes.get(`/`, (req, res) => {
    const {query: searchText} = req.query;

    if (!searchText) {
      res.status(HttpCode.BAD_REQUEST).json(`Empty query string`);
      return;
    }

    const articles = searchService.findAll(searchText);

    if (!articles.length) {
      res.status(HttpCode.NOT_FOUND).json(`No articles for "${searchText}" query`);
      return;
    }

    res.status(HttpCode.OK).json(articles);
  });
};
