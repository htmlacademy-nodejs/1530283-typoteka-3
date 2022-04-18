"use strict";

const {Server} = require(`socket.io`);

const {HttpMethod, Port, HostName} = require(`../../constants`);

const ORIGIN = `${HostName.SSR}:${Port.SSR}`;

module.exports = (server) => new Server(server, {
  cors: {
    origins: [ORIGIN],
    methods: HttpMethod.GET,
  }
});

