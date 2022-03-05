'use strict';

const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);

module.exports = {
  name: `--fill-db`,
  run: async () => {
    try {
      console.info(`Database initializing...`);
      await initDb(sequelize);
      console.info(`Database is initialized successfully`);
    } catch (error) {
      console.error(`Database initialization failed: ${error}`);
    }
  },
};
