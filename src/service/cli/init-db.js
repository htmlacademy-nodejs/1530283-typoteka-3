"use strict";

const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);

const {getLogger} = require(`../lib/logger/logger`);
const {ExitCode} = require(`../../constants`);

const logger = getLogger({name: `init-db`});

module.exports = {
  name: `--init-db`,
  run: async () => {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established successfully`);
    } catch (err) {
      logger.error(
          `An error occurred during database connection: ${err.message}`
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
