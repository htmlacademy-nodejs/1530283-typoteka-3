'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);

const defineModels = require(`../models`);

const category = require(`./category`);
const article = require(`./article`);
const comment = require(`./comment`);
const search = require(`./search`);

const {ArticleService, CategoryService, SearchService, CommentService} = require(`../data-service`);

const api = new Router();

defineModels(sequelize);

(async () => {

  const commentService = new CommentService(sequelize);
  const articleService = new ArticleService(sequelize);
  const categoryService = new CategoryService(sequelize);
  const searchService = new SearchService(sequelize);

  article(api, articleService, commentService);
  category(api, categoryService);
  search(api, searchService);
  comment(api, commentService);
})();

module.exports = api;
