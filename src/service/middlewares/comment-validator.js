"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {prepareErrors} = require(`../../utils/common`);

const CommentRestriction = {
  TEXT_MIN: 20,
  TEXT_MAX: 255,
};

const CommentErrorMessage = {
  TEXT_MIN: `Комментарий содержит меньше ${CommentRestriction.TEXT_MIN} символов`,
  TEXT_MAX: `Комментарий не может содержать более ${CommentRestriction.TEXT_MAX} символов`,
  TEXT_EMPTY: `Введите комментарий`,
};

const schema = Joi.object({
  text: Joi.string()
    .min(CommentRestriction.TEXT_MIN)
    .max(CommentRestriction.TEXT_MAX)
    .required()
    .messages({
      "string.min": CommentErrorMessage.TEXT_MIN,
      "string.max": CommentErrorMessage.TEXT_MAX,
      "string.empty": CommentErrorMessage.TEXT_EMPTY,
    }),
  authorId: Joi.number()
});

const commentValidator = (req, res, next) => {
  const newСomment = req.body;

  const {error} = schema.validate(newСomment, {abortEarly: false});

  if (error) {
    res.status(HttpCode.BAD_REQUEST).json(prepareErrors(error));
    return;
  }

  next();
};

module.exports = commentValidator;
