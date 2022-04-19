"use strict";

const path = require(`path`);
const express = require(`express`);

const {HostName, Port, ExitCode} = require(`../constants`);

const {rootRoutes, errorRoutes, myRoutes, articlesRoutes} = require(`./routes`);

const {clientError, serverError} = require(`./middlewares`);

const helmet = require(`./lib/helmet`);
const {session} = require(`./lib/session`);
const sequelize = require(`../service/lib/sequelize`);
const {getLogger} = require(`../service/lib/logger`);

const Dir = {
  TEMPLATES: `templates`,
  PUBLIC: `public`,
  UPLOAD: `upload`,
};

const LOGGER_NAME = `ssr`;

const logger = getLogger({name: LOGGER_NAME});

const app = express();

app.use(session());

app.use(helmet());

app.use(express.urlencoded({extended: false}));

app.set(`views`, path.resolve(__dirname, Dir.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));

app.use(`/`, rootRoutes);
app.use(`/`, errorRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use(clientError());
app.use(serverError());

(async () => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    await sequelize.sync({force: false});
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }

  logger.info(`Connection to database established`);

  try {
    app.listen(Port.SSR, HostName.SSR, (err) => {
      if (err) {
        logger.error(
            `An error occurred on server creation: ${err.message}`
        );
        process.exit(ExitCode.ERROR);
      }

      logger.info(`Listening to connections on ${Port.SSR}`);
    });
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
})();
