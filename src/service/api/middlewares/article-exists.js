"use strict";

const {HttpCode} = require(`../../../constants`);

const articleExists = (articleService) => async (req, res, next) => {
  const {articleId} = req.params;

  try {
    const isExist = await articleService.checkExistence(Number(articleId));

    if (!isExist) {
      throw new Error(`No article with id = ${articleId}`);
    }

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(error.message);
  }
};

module.exports = articleExists;
