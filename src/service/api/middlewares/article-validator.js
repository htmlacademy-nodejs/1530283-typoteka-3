'use strict';

const {HttpCode} = require(`../../../constants`);

const requiredArticleKeys = [`title`, `announce`, `fullText`, `createdDate`, `category`];

const articleValidator = (req, res, next) => {
  const newArticle = req.body;
  const absentKeys = [];
  const articleKeys = Object.keys(newArticle);

  for (const requiredKey of requiredArticleKeys) {
    const keyExists = articleKeys.includes(requiredKey);
    if (!keyExists) {
      absentKeys.push(requiredKey);
    }
  }

  if (absentKeys.length) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Article does not have required fields: ${absentKeys.join(`, `)}`);
    return;
  }

  next();
};

module.exports = articleValidator;
