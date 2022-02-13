"use strict";

const pino = require(`pino`);
const {Environment} = require(`../../constants`);

const LOG_FILE = `./logs/api.log`;
const DEFAULT_LOG_LEVEL = `info`;

const isDevMode = process.env.NODE_ENV === Environment.DEVELOPMENT;

const logger = pino(
    {
      name: `base-logger`,
      level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
      prettyPrint: isDevMode,
    },
    isDevMode ? process.stdout : pino.destination(LOG_FILE)
);

module.exports = {
  getLogger(options = {}) {
    return logger.child(options);
  },
};
