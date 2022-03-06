'use strict';

const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);

const {ExitCode} = require(`../../constants`);

module.exports = {
  name: `--fill-db`,
  run: async () => {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      console.info(`Connection to database established`);
    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }


    try {
      console.info(`Database initializing...`);
      await initDb(sequelize);
      console.info(`Database is initialized successfully`);
    } catch (error) {
      console.error(`Database initialization failed: ${error}`);
      process.exit(ExitCode.ERROR);
    }
  },
};
