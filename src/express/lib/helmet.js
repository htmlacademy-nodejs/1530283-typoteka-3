"use strict";

const helmet = require(`helmet`);

const SCRIPT_SOURCES = [
  `'self' 'unsafe-eval'`,
  `https://unpkg.com/dayjs@1.8.21/dayjs.min.js`,
];

module.exports = () => helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: SCRIPT_SOURCES,
    },
  },
});
