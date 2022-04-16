"use strict";

const csurf = require(`csurf`);

const csrf = () => csurf({cookie: false});

module.exports = csrf;
