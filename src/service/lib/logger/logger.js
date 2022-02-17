"use strict";

const path = require(`path`);
const pino = require(`pino`);
const {Environment} = require(`../../../constants`);

const DEFAULT_LOG_LEVEL = `info`;

const isDevMode = process.env.NODE_ENV === Environment.DEVELOPMENT;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  transport: {
    target: isDevMode ? `./pino-pretty-target` : `pino/file`,
    options: {
      destination: !isDevMode ? path.resolve(__dirname, `../../../logs/api.log`) : undefined,
    }
  }
});

module.exports = {
  logger,
  getLogger: (options = {}) => logger.child(options),
};
