"use strict";

const {HttpCode} = require(`../../../constants`);

const commentExists = (commentService) => async (req, res, next) => {
  const {commentId} = req.params;

  try {
    await commentService.checkExistence(Number(commentId));

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(`No comment with id = ${commentId}`);
  }
};

module.exports = commentExists;
