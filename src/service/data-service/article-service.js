"use strict";

const {getId} = require(`../../utils`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(articleId) {
    return this._articles.find((article) => article.id === articleId);
  }

  create(article) {
    const newArticle = Object.assign(
        {
          id: getId(),
          comments: [],
        },
        article
    );

    this._articles.push(newArticle);
    return newArticle;
  }

  update(oldArticle, newArticle) {
    return Object.assign(oldArticle, newArticle);
  }

  drop(articleId) {
    const articleIndex = this._articles.findIndex(
        (article) => article.id === articleId
    );

    this._articles.splice(articleIndex, 1);
  }
}

module.exports = ArticleService;
