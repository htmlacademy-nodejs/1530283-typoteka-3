"use strict";

const auth = require(`./auth`);
const admin = require(`./admin`);
const guest = require(`./guest`);
const upload = require(`./upload`);
const clientError = require(`./client-error`);
const serverError = require(`./server-error`);

module.exports = {
  auth, admin, guest, upload, clientError, serverError
};
