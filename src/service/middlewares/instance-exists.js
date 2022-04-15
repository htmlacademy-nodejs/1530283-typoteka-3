"use strict";

const {HttpCode} = require(`../../constants`);

const instanceExists = (service, pathParam) => async (req, res, next) => {
  const id = req.params[pathParam];

  try {
    const isExist = await service.checkExistence(Number(id));

    if (!isExist) {
      throw new Error(`No instance with ${pathParam} = ${id}`);
    }

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(error.message);
  }
};

module.exports = instanceExists;
