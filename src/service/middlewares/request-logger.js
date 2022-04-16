"use strict";

const requestLogger = (logger) => (req, res, next) => {
  logger.debug(`${req.id}: ${req.method} Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`${req.id}: Response status code ${res.statusCode}`);
  });

  next();
};

module.exports = requestLogger;
