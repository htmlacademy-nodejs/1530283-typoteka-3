"use strict";

const fs = require(`fs`);
const path = require(`path`);
const pino = require(`pino`);

const {Environment} = require(`../../../constants`);

const DEFAULT_LOG_LEVEL = `info`;
const LOG_FILENAME = `api.log`;

const logDirectory = path.resolve(__dirname, `../../../../logs`);

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const isDevMode = process.env.NODE_ENV === Environment.DEVELOPMENT;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  transport: {
    target: isDevMode ? `./pino-pretty-target` : `pino/file`,
    options: {
      destination: !isDevMode ? path.resolve(logDirectory, LOG_FILENAME) : undefined,
    }
  }
});

module.exports = logger;
