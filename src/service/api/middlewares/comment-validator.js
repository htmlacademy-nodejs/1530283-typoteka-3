'use strict';

const {HttpCode} = require(`../../../constants`);

const requiredCommentKeys = [`text`];

const commentValidator = (req, res, next) => {
  const newComment = req.body;
  const absentKeys = [];
  const commentKeys = Object.keys(newComment);

  for (const requiredKey of requiredCommentKeys) {
    const keyExists = commentKeys.includes(requiredKey);
    if (!keyExists) {
      absentKeys.push(requiredKey);
    }
  }

  if (absentKeys.length) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Comment does not have required fields: ${absentKeys.join(`, `)}`);
    return;
  }

  next();
};

module.exports = commentValidator;
