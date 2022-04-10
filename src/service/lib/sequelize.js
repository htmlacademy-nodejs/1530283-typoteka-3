"use strict";

const Sequelize = require(`sequelize`);

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const DB_DIALECT = `postgres`;

const DB_POOL_SETTINGS = {
  min: 0,
  max: 5,
  acquire: 10000,
  idle: 10000,
};

const DB_LOGGING = false;

const somethingIsNotDefined = [
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_LOGGING,
].some((value) => value === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  pool: DB_POOL_SETTINGS,
  logging: DB_LOGGING,
});

