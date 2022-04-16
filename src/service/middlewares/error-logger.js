"use strict";

const errorLogger = (logger) => (err, req, _res, next) => {
  logger.error(
      `${req.id}: An error occurred on processing request: ${err.message}`
  );
  next(err);
};

module.exports = errorLogger;
