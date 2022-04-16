"use strict";

const myRoutes = require(`./my-routes`);
const errorRoutes = require(`./error-routes`);
const rootRoutes = require(`./root-routes`);
const articlesRoutes = require(`./articles-routes`);

module.exports = {
  myRoutes,
  errorRoutes,
  rootRoutes,
  articlesRoutes
};
