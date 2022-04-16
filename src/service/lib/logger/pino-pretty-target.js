"use strict";

const pinoPretty = require(`pino-pretty`);

const {formatTimestamp} = require(`../../../utils/date`);

module.exports = (opts) => pinoPretty({
  ...opts,
  customPrettifiers: {
    time: formatTimestamp,
  }
});
