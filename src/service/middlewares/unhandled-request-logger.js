"use strict";

const unhandledRequestLogger = (logger) => (req, _res, next) => {
  logger.error(`Route not found: ${req.url}`);
  next();
};

module.exports = unhandledRequestLogger;
