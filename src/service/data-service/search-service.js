'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    if (searchText === ``) {
      return this._articles;
    }

    const articles = [];

    const regExp = new RegExp(searchText, `i`);

    for (const article of this._articles) {
      if (regExp.test(article.title)) {
        articles.push(article);
      }
    }

    return articles;
  }
}

module.exports = SearchService;
