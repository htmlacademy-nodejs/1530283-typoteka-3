'use strict';

const {HttpCode} = require(`../../../constants`);

const articleExists = (articleService) => async (req, res, next) => {
  const {articleId} = req.params;

  try {
    const article = await articleService.findOne(articleId);

    res.locals.article = article;

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(`No article with id = ${articleId}`);
  }
};

module.exports = articleExists;
