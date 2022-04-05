"use strict";

const parseClientUser = (clientUser, file) => ({
  firstName: clientUser.name,
  lastName: clientUser.surname,
  email: clientUser.email,
  password: clientUser.password,
  passwordRepeated: clientUser[`repeat-password`],
  avatar: file ? file.filename : clientUser.filename,
});

module.exports = {
  parseClientUser,
};
