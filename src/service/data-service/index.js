"use strict";

const ArticleService = require(`./article-service`);
const CommentService = require(`./comment-service`);
const CategoryService = require(`./category-service`);
const SearchService = require(`./search-service`);
const UserService = require(`./user-service`);

module.exports = {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
  UserService
};
