"use strict";

const {HttpCode} = require(`../../constants`);

const instanceExists = (service, pathParam) => async (req, res, next) => {
  const id = req.params[pathParam];

  try {
    const instance = await service.checkExistence(Number(id));

    if (!instance) {
      throw new Error(`No instance with ${pathParam} = ${id}`);
    }

    res.locals[`${pathParam}Instance`] = instance;

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(error.message);
  }
};

module.exports = instanceExists;
