"use strict";

const helmet = require(`helmet`);

const {Port, HostName} = require(`../../constants`);

const SCRIPT_SOURCES = [
  `'self' 'unsafe-eval'`,
  `https://unpkg.com/dayjs@1.8.21/dayjs.min.js`,
  `https://cdn.socket.io/4.0.1/socket.io.js`,
];

const CONNECT_SOURCES = [
  `'self'`,
  `http://${HostName.API}:${Port.API}`,
  `ws://${HostName.API}:${Port.API}`,
];

module.exports = () => helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: SCRIPT_SOURCES,
      connectSrc: CONNECT_SOURCES,
    },
  },
});
