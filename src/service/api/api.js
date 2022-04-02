"use strict";

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);

const defineModels = require(`../models`);

const category = require(`./category`);
const article = require(`./article`);
const comment = require(`./comment`);
const search = require(`./search`);
const user = require(`./user`);

const {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
  UserService,
} = require(`../data-service`);

const api = new Router();

defineModels(sequelize);

(async () => {
  const commentService = new CommentService(sequelize);
  const articleService = new ArticleService(sequelize);
  const categoryService = new CategoryService(sequelize);
  const searchService = new SearchService(sequelize);
  const userService = new UserService(sequelize);

  article(api, articleService, commentService, categoryService);
  category(api, categoryService);
  search(api, searchService);
  comment(api, commentService);
  user(api, userService);
})();

module.exports = api;
