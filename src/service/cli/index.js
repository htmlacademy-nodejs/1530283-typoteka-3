"use strict";

const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const fillDb = require(`./fill-db`);
const initDb = require(`./init-db`);

module.exports = {
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
  [fillDb.name]: fillDb,
  [initDb.name]: initDb,
};
