"use strict";

const {HttpCode} = require(`../../../constants`);

const articleExists = (articleService) => async (req, res, next) => {
  const {articleId} = req.params;

  try {
    await articleService.checkExistence(Number(articleId));

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(`No article with id = ${articleId}`);
  }
};

module.exports = articleExists;
