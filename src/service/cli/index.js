'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const server = require(`./server`);
const fill = require(`./fill`);
const fillDb = require(`./fill-db`);

module.exports = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
  [server.name]: server,
  [fill.name]: fill,
  [fillDb.name]: fillDb,
};
