"use strict";

const session = require(`express-session`);

const {sessionStore, SESSION_EXPIRATION_TIME} = require(`./session-store`);

const DEFAULT_SESSION_SECRET = `secret`;

const SESSION_COOKIE_NAME = `session.id`;

const SESSION_CONFIG = {
  name: SESSION_COOKIE_NAME,
  resave: false,
  proxy: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    path: `/`,
    httpOnly: true,
    maxAge: SESSION_EXPIRATION_TIME,
    sameSite: `lax`,
  }
};

const SESSION_SECRET = process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET;

module.exports = {
  SESSION_COOKIE_NAME,
  session: () => session({
    secret: SESSION_SECRET,
    store: sessionStore,
    ...SESSION_CONFIG
  })
};
