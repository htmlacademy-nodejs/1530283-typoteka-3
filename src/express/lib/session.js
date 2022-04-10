"use strict";

const session = require(`express-session`);
const sessionStore = require(`./session-store`);

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

module.exports = session({
  secret: SESSION_SECRET,
  store: sessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
});
