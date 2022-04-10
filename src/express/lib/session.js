"use strict";

const session = require(`express-session`);
const sessionStore = require(`./session-store`);

const SESSION_CONFIG = {
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: {
    // path: `/`,
    // httpOnly: true,
    // secure: true,
    // maxAge: null,
    // sameSite: `lax`
  }
};

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

module.exports = session({
  secret: SESSION_SECRET,
  store: sessionStore,
  ...SESSION_CONFIG
});
