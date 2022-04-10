"use strict";

const session = require(`express-session`);
const connectSessionSequelize = require(`connect-session-sequelize`);
const sequelize = require(`../../service/lib/sequelize`);

const SESSION_EXPIRATION = 3 * 60 * 1000; // 3 minutes
const CHECK_SESSION_EXPIRATION_INTERVAL = 1 * 60 * 10000; //  1 minute
const SESSION_TABLE_NAME = `sessions`;

const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: SESSION_EXPIRATION,
  checkExpirationInterval: CHECK_SESSION_EXPIRATION_INTERVAL,
  tableName: SESSION_TABLE_NAME,
});

sequelize.sync({force: false});

module.exports = sessionStore;
