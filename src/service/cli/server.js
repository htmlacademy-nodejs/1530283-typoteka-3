"use strict";

const express = require(`express`);
const requestId = require(`express-request-id`);

const {HttpCode} = require(`../../constants`);
const apiRoutes = require(`../api/api`);
const {getLogger} = require(`../lib/logger/logger`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;
const Messages = {
  NOT_FOUND_MESSAGE: `Not found`,
  SERVER_ERROR_MESSAGE: `Internal server error`,
};

const logger = getLogger({name: `api`});

const logEveryRequest = (req, res, next) => {
  logger.debug(`${req.id}: ${req.method} Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`${req.id}: Response status code ${res.statusCode}`);
  });

  next();
};

const logUnhandledRequest = (req, _res, next) => {
  logger.error(`Route not found: ${req.url}`);
  next();
};

const logInternalError = (err, req, _res, next) => {
  logger.error(`${req.id}: An error occurred on processing request: ${err.message}`);
  next(err);
};

const sendNotFoundResponse = (_req, res) => {
  res.status(HttpCode.NOT_FOUND).send(Messages.NOT_FOUND_MESSAGE);
};

const sendServerErrorResponse = (_err, _req, res, _next) => {
  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(Messages.SERVER_ERROR_MESSAGE);
};

const app = express();

app.use(express.json());

app.use(requestId());

app.use(logEveryRequest);

app.use(API_PREFIX, apiRoutes);

app.use(logUnhandledRequest);
app.use(logInternalError);

app.use(sendNotFoundResponse);
app.use(sendServerErrorResponse);

module.exports = {
  name: `--server`,
  run(args) {
    const [rawPort] = args;
    const port = Number.parseInt(rawPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(
              `An error occurred on server creation: ${err.message}`
          );
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  },
};
