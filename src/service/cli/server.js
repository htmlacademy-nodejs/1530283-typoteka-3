"use strict";

const express = require(`express`);
const requestId = require(`express-request-id`);
const helmet = require(`helmet`);
const {ExitCode} = require(`../../constants`);
const api = require(`../api/api`);
const {getLogger} = require(`../lib/logger/logger`);
const sequelize = require(`../lib/sequelize`);
const {
  requestLogger,
  unhandledRequestLogger,
  errorLogger,
  bodyTrimmer,
  clientError,
  serverError
} = require(`../middlewares`);

const API_PREFIX = `/api`;
const DEFAULT_PORT = 3000;
const LOGGER_NAME = `api`;

const logger = getLogger({name: LOGGER_NAME});

const app = express();

app.use(helmet());

app.use(express.json());

app.use(requestId());

app.use(requestLogger(logger));

app.use(bodyTrimmer());

app.use(API_PREFIX, api());

app.use(unhandledRequestLogger(logger));
app.use(errorLogger(logger));

app.use(clientError());
app.use(serverError());

module.exports = {
  name: `--server`,
  run: async (args) => {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Connection to database established`);

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
      process.exit(ExitCode.ERROR);
    }
  },
};
