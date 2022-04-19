"use strict";

const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const fillDb = require(`./fill-db`);
const initDb = require(`./init-db`);

module.exports = {
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fillDb.name]: fillDb,
  [initDb.name]: initDb,
};
