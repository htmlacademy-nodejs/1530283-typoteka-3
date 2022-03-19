"use strict";

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

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

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  getCategories(params = {}) {
    return this._load(`/categories`, {params});
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data,
    });
  }

  updateCategory({id, data}) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE,
    });
  }


  getComments({articleId, ...params} = {}) {
    return articleId
      ? this._load(`articles/${articleId}/comments`, {params})
      : this._load(`comments`, {params});
  }

  createComment({articleId, data}) {
    return this._load(`/articles/${articleId}/comments`, {
      method: HttpMethod.POST,
      data,
    });
  }

  deleteComment(id) {
    return this._load(`/comments/${id}`, {
      method: HttpMethod.DELETE,
    });
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
