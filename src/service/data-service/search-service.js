"use strict";

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    const regExp = new RegExp(searchText, `i`);

    return this._articles.filter((article) => regExp.test(article.title));
  }
}

module.exports = SearchService;
