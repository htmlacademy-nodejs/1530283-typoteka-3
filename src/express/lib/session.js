"use strict";

const session = require(`express-session`);
const {sessionStore, SESSION_EXPIRATION_TIME} = require(`./session-store`);

const SESSION_COOKIE_NAME = `session.id`;

const SESSION_CONFIG = {
  name: SESSION_COOKIE_NAME,
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: {
    path: `/`,
    httpOnly: true,
    maxAge: SESSION_EXPIRATION_TIME,
    sameSite: `lax`,
  }
};

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

module.exports = {
  SESSION_COOKIE_NAME,
  session: session({
    secret: SESSION_SECRET,
    store: sessionStore,
    ...SESSION_CONFIG
  })
};
