'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);
const sequelize = require(`../lib/sequelize`);

const defineModels = require(`../models`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const {ArticleService, CategoryService, SearchService, CommentService} = require(`../data-service`);

const api = new Router();

defineModels(sequelize);

(async () => {
  const mockData = await getMockData();

  article(api, new ArticleService(mockData), new CommentService(mockData));
  category(api, new CategoryService(mockData));
  search(api, new SearchService(mockData));
})();

module.exports = api;
