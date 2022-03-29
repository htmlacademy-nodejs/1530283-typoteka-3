"use strict";

const {HttpCode} = require(`../../constants`);

const commentExists = (commentService) => async (req, res, next) => {
  const {commentId} = req.params;

  try {
    const isExist = await commentService.checkExistence(Number(commentId));

    if (!isExist) {
      throw new Error(`No comment with id = ${commentId}`);
    }

    next();
  } catch (error) {
    res.status(HttpCode.NOT_FOUND).send(error.message);
  }
};

module.exports = commentExists;
