'use strict';

const {Router} = require(`express`);

const articlesRoutes = new Router();

articlesRoutes.get(`/category/:id`, () => {
  throw new Error(`message`);
});

articlesRoutes.get(`/add`, () => {
  throw new Error(`message`);
});

articlesRoutes.get(`/edit/:id`, () => {
  throw new Error(`message`);
});

articlesRoutes.get(`/:id`, () => {
  throw new Error(`message`);
});

module.exports = articlesRoutes;

