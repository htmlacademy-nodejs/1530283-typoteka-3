"use strict";

const {HttpMethod} = require(`../../constants`);

const bodyTrimmer = () => (req, _res, next) => {
  const {method} = req;

  if (method === HttpMethod.POST || method === HttpMethod.PUT) {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === `string`) {
        req.body[key] = value.trim();
      }
    }
  }

  next();
};

module.exports = bodyTrimmer;
