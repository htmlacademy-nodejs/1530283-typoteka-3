"use strict";

const chalk = require(`chalk`);
const express = require(`express`);

const {HttpCode} = require(`../../constants`);
const apiRoutes = require(`../api/api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;
const Messages = {
  NOT_FOUND_MESSAGE: `Ресурс не найден`,
  SERVER_ERROR_MESSAGE: `Ошибка сервера`,
};

const logger = getLogger({name: `api`});

const logEveryRequest = (req, res, next) => {
  logger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
};

const logUnhandledRequest = (req, res, next) => {
  logger.error(`Route not found: ${req.url}`);
  next();
};

const logInternalError = (err, req, res, next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
  next();
};

const sendNotFoundResponse = (req, res) => {

  res.status(HttpCode.NOT_FOUND).send(Messages.NOT_FOUND_MESSAGE);
};

const sendServerErrorResponse = (err, req, res, next) => {
  logger.error(`${err}`);

  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(Messages.SERVER_ERROR_MESSAGE);
  next();
};

const app = express();

app.use(express.json());

app.use(logEveryRequest);

app.use(`/api`, apiRoutes);

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
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  },
};
