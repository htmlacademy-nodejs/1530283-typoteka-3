'use strict';

const {Router} = require(`express`);

const myRoutes = new Router();

myRoutes.get(`/`, () => {
  throw new Error(`message`);
});

myRoutes.get(`/comments`, () => {
  throw new Error(`message`);
});

myRoutes.get(`/categories`, () => {
  throw new Error(`message`);
});

module.exports = myRoutes;
