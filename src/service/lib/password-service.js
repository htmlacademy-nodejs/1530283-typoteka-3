"use strict";

const {hash, hashSync, compare} = require(`bcrypt`);

const SALT_ROUNDS = 10;

const passwordService = {
  hash: (password) => hash(password, SALT_ROUNDS),
  hashSync: (password) => hashSync(password, SALT_ROUNDS),
  compare
};

module.exports = passwordService;
