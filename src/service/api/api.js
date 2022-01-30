'use strict';

const {Router} = require(`express`);

const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const api = new Router();

(() => {
  article(api);
  category(api);
  search(api);
})();

module.exports = api;
