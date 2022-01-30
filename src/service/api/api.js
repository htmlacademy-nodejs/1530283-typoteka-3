'use strict';

const {Router} = require(`express`);

const getMockData = require(`../lib/get-mock-data`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const {ArticleService} = require(`../data-service`);

const api = new Router();

(async () => {
  const mockData = await getMockData();

  article(api, new ArticleService(mockData));
  category(api);
  search(api);
})();

module.exports = api;
