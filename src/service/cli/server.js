"use strict";

const http = require(`http`);
const express = require(`express`);
const requestId = require(`express-request-id`);
const helmet = require(`helmet`);

const {Port, HostName, ExitCode} = require(`../../constants`);

const socket = require(`../lib/socket`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);

const api = require(`../api/api`);

const {
  requestLogger,
  unhandledRequestLogger,
  errorLogger,
  bodyTrimmer,
  clientError,
  serverError
} = require(`../middlewares`);

const API_PREFIX = `/api`;
const LOGGER_NAME = `api`;

const logger = getLogger({name: LOGGER_NAME});

const app = express();
const server = http.createServer(app);

app.locals.socket = socket(server);

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
      await sequelize.sync({force: false});
    } catch (error) {
      logger.error(`An error occurred: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Connection to database established`);

    const [rawPort] = args;
    const port = Number.parseInt(rawPort, 10) || Port.API;

    try {
      server.listen(port, HostName.API, (error) => {
        if (error) {
          logger.error(
              `An error occurred on server creation: ${error.message}`
          );
          process.exit(ExitCode.ERROR);
        }

        logger.info(`Listening to connections on ${port}`);
      });
    } catch (error) {
      logger.error(`An error occurred: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }
  },
};
