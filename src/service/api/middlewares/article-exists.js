'use strict';

const {HttpCode} = require(`../../../constants`);

const articleExists = (articleService) => async (req, res, next) => {
  const {articleId} = req.params;

  try {
    const article = await articleService.findOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND).send(`No article with id = ${articleId}`);
      return;
    }

    res.locals.article = article;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = articleExists;
