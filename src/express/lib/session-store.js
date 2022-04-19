"use strict";

const session = require(`express-session`);
const connectSessionSequelize = require(`connect-session-sequelize`);

const sequelize = require(`../../service/lib/sequelize`);

const SESSION_EXPIRATION_TIME = 60 * 60 * 1000; // 60 minutes
const CHECK_SESSION_EXPIRATION_INTERVAL = 1 * 60 * 1000; //  1 minute
const SESSION_TABLE_NAME = `sessions`;

const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: SESSION_EXPIRATION_TIME,
  checkExpirationInterval: CHECK_SESSION_EXPIRATION_INTERVAL,
  tableName: SESSION_TABLE_NAME,
});

module.exports = {
  SESSION_EXPIRATION_TIME,
  sessionStore
};
