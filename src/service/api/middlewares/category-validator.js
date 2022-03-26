"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../../constants`);

const CategoryRestriction = {
  NAME_MIN: 5,
  NAME_MAX: 30,
};

const CategoryErrorMessage = {
  NAME_MIN: `Название содержит меньше ${CategoryRestriction.NAME_MIN} символов`,
  NAME_MAX: `Название не может содержать более ${CategoryRestriction.NAME_MAX} символов`,
  NAME_EMPTY: `Введите название`,
  NAME_NON_UNIQUE: `Название должно быть уникальным`,
};

const schema = Joi.object({
  name: Joi.string()
    .trim()
    .min(CategoryRestriction.NAME_MIN)
    .max(CategoryRestriction.NAME_MAX)
    .required()
    .messages({
      "string.min": CategoryErrorMessage.NAME_MIN,
      "string.max": CategoryErrorMessage.NAME_MAX,
      "string.empty": CategoryErrorMessage.NAME_EMPTY,
    }),
});

const categoryValidator = (service) => async (req, res, next) => {
  const newCategory = req.body;

  const validationResult = schema.validate(newCategory, {abortEarly: false});

  const {error} = validationResult;

  if (error) {
    res
      .status(HttpCode.BAD_REQUEST)
      .json(error.details.reduce(
          (errors, {message, context}) => ({
            ...errors,
            [context.key]: message,
          }),
          {}
      ));
    return;
  }

  const isNonUnique = Boolean(await service.findByName(req.body.name));

  if (isNonUnique) {
    res
    .status(HttpCode.BAD_REQUEST)
    .json({
      name: CategoryErrorMessage.NAME_NON_UNIQUE
    });
    return;
  }

  next();
};

module.exports = categoryValidator;
