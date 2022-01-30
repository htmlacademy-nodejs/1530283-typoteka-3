'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const {ArticleService, CategoryService, SearchService} = require(`../data-service`);

const api = new Router();

(async () => {
  const mockData = await getMockData();
  article(api, new ArticleService(mockData));
  category(api, new CategoryService(mockData));
  search(api, new SearchService(mockData));
})();

module.exports = api;
