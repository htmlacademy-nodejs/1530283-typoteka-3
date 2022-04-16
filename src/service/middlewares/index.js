"use strict";

const articleValidator = require(`./article-validator`);
const commentValidator = require(`./comment-validator`);
const categoryValidator = require(`./category-validator`);
const authValidator = require(`./auth-validator`);
const userValidator = require(`./user-validator`);
const instanceExists = require(`./instance-exists`);
const requestLogger = require(`./request-logger`);
const unhandledRequestLogger = require(`./unhandled-request-logger`);
const routeParamsValidator = require(`./route-params-validator`);
const errorLogger = require(`./error-logger`);
const bodyTrimmer = require(`./body-trimmer`);
const clientError = require(`./client-error`);
const serverError = require(`./server-error`);

module.exports = {
  articleValidator,
  commentValidator,
  categoryValidator,
  authValidator,
  userValidator,
  errorLogger,
  instanceExists,
  requestLogger,
  unhandledRequestLogger,
  routeParamsValidator,
  bodyTrimmer,
  clientError,
  serverError,
};
