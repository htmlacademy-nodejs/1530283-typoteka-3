"use strict";

const {HttpCode} = require(`../../../constants`);

const requiredArticleKeys = [
  `title`,
  `announce`,
  `fullText`,
  `createdAt`,
  `categories`,
  `authorId`,
];

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
    const formattedAbsentKeys = absentKeys.join(`, `);
    res
      .status(HttpCode.BAD_REQUEST)
      .send(`Article does not have required fields: ${formattedAbsentKeys}`);
    return;
  }

  next();
};

module.exports = articleValidator;
