"use strict";

const logger = require(`./logger`);

module.exports = {
  logger,
  getLogger: (options = {}) => logger.child(options),
};
