"use strict";

const ArticleService = require(`./article-service`);
const CommentService = require(`./comment-service`);
const CategoryService = require(`./category-service`);
const SearchService = require(`./search-service`);

module.exports = {
  ArticleService,
  CategoryService,
  SearchService,
  CommentService,
};
