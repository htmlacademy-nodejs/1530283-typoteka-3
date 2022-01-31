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

  update(articleId, newArticle) {
    const oldArticle = this._articles.find((article) => article.id === articleId);

    return oldArticle ? Object.assign(oldArticle, newArticle) : oldArticle;
  }

  drop(articleId) {
    const articleIndex = this._articles.findIndex(
        (article) => article.id === articleId
    );

    if (articleIndex === -1) {
      return null;
    }

    const article = this._articles[articleIndex];

    this._articles.splice(articleIndex, 1);

    return article;
  }
}

module.exports = ArticleService;
