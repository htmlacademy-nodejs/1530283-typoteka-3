'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);

module.exports = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
};
