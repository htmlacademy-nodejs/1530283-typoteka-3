"use strict";

const {ExitCode} = require(`../../constants`);

const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `initdb`});

module.exports = {
  name: `--initdb`,
  run: async () => {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established successfully`);
    } catch (error) {
      logger.error(
          `An error occurred during database connection: ${error.message}`
      );
      process.exit(ExitCode.ERROR);
    }

    try {
      logger.info(`Database initializing...`);
      await initDb(sequelize);
      logger.info(`Database is initialized successfully`);
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      logger.error(`An error occurred during database initializing: ${error}`);
      process.exit(ExitCode.ERROR);
    }
  },
};
