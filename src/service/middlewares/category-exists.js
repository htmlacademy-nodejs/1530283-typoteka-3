"use strict";

const {HttpCode} = require(`../../constants`);

const categoryExists = (categoryService) => async (req, res, next) => {
  const {categoryId} = req.params;

  try {
    await categoryService.checkExistence(Number(categoryId));

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(`No category with id = ${categoryId}`);
  }
};

module.exports = categoryExists;
