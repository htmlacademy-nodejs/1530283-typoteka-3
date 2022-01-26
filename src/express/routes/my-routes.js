'use strict';

const {Router} = require(`express`);
const {sendPath} = require(`../../utils`);

const myRoutes = new Router();

myRoutes.get(`/`, sendPath);

myRoutes.get(`/comments`, sendPath);

myRoutes.get(`/categories`, sendPath);

module.exports = myRoutes;
