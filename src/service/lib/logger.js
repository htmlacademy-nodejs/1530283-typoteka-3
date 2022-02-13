'use strict';

const logger = require(`pino`)({
  name: `logger`,
  level: process.env.LOG_LEVEL || `info`
});

module.exports = {
  getLogger(options = {}) {
    return logger.child(options);
  }
};
