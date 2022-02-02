'use strict';

const {HttpCode} = require(`../../../constants`);

const articleExists = (articleService) => (req, res, next) => {
  const {articleId} = req.params;
  const article = articleService.findOne(articleId);

  if (!article) {
    res.status(HttpCode.NOT_FOUND).send(`No article with id = ${articleId}`);
    return;
  }

  res.locals.article = article;
  next();
};

module.exports = articleExists;
