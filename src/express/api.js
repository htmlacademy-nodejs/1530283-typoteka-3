"use strict";

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles(params) {
    return this._load(`/articles`, {params});
  }

  getArticle(articleId) {
    return this._load(`/articles/${articleId}`);
  }

  getCategories(params) {
    return this._load(`/categories`, {params});
  }

  getComments(articleId) {
    return articleId
      ? this._load(`articles/${articleId}/comments`)
      : this._load(`comments`);
  }

  search(query) {
    return this._load(`search`, {
      params: {
        query,
      },
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
