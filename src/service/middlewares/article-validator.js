"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {prepareErrors} = require(`../../utils/common`);

const ArticleRestriction = {
  TITLE_MIN: 30,
  TITLE_MAX: 250,
  ANNOUNCE_MIN: 30,
  ANNOUNCE_MAX: 250,
  FULL_TEXT_MIN: 0,
  FULL_TEXT_MAX: 1000,
  CATEGORIES_COUNT_MIN: 1,
  PICTURE_EXTENSIONS: [`jpg`, `jpeg`, `png`],
};

const ArticleErrorMessage = {
  TITLE_MIN: `Заголовок содержит меньше ${ArticleRestriction.TITLE_MIN} символов`,
  TITLE_MAX: `Заголовок не может содержать более ${ArticleRestriction.TITLE_MAX} символов`,
  TITLE_EMPTY: `Введите заголовок`,
  ANNOUNCE_MIN: `Анонс содержит меньше ${ArticleRestriction.ANNOUNCE_MIN} символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более ${ArticleRestriction.ANNOUNCE_MAX} символов`,
  ANNOUNCE_EMPTY: `Введите анонс`,
  FULL_TEXT_MAX: `Полный текст публикации не может содержать более ${ArticleRestriction.FULL_TEXT_MAX} символов`,
  CATEGORIES_COUNT_MIN: `Должна быть выбрана как минимум одна категория`,
  DATE_FORMAT: `Некорректная дата`,
  PICTURE_EXTENSIONS: `Недопустимый тип файла фотографии. Допустимые типы ${ArticleRestriction.PICTURE_EXTENSIONS.map(
      (extension) => `*.${extension}`
  ).join(`, `)}`,
};

const schema = Joi.object({
  title: Joi.string()
    .min(ArticleRestriction.TITLE_MIN)
    .max(ArticleRestriction.TITLE_MAX)
    .required()
    .messages({
      "string.min": ArticleErrorMessage.TITLE_MIN,
      "string.max": ArticleErrorMessage.TITLE_MAX,
      "string.empty": ArticleErrorMessage.TITLE_EMPTY,
    }),
  picture: Joi.string()
    .allow(``)
    .custom((value, helper) => {
      if (!value) {
        return true;
      }

      const extension = value.split(`.`).pop();

      return (
        ArticleRestriction.PICTURE_EXTENSIONS.includes(extension) ||
        helper.message(ArticleErrorMessage.PICTURE_EXTENSIONS)
      );
    }),
  createdAt: Joi.date().iso().messages({
    "date.format": ArticleErrorMessage.DATE_FORMAT,
  }),
  categories: Joi.array()
    .required()
    .items(Joi.number().integer())
    .unique()
    .min(ArticleRestriction.CATEGORIES_COUNT_MIN)
    .messages({
      "array.min": ArticleErrorMessage.CATEGORIES_COUNT_MIN,
    }),
  announce: Joi.string()
    .required()
    .min(ArticleRestriction.ANNOUNCE_MIN)
    .max(ArticleRestriction.ANNOUNCE_MAX)
    .messages({
      "string.min": ArticleErrorMessage.ANNOUNCE_MIN,
      "string.max": ArticleErrorMessage.ANNOUNCE_MAX,
      "string.empty": ArticleErrorMessage.ANNOUNCE_EMPTY,
    }),
  fullText: Joi.string().allow(``).max(ArticleRestriction.FULL_TEXT_MAX),
  authorId: Joi.number(),
});

const articleValidator = (categoryService) => async (req, res, next) => {
  const newArticle = req.body;

  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    res.status(HttpCode.BAD_REQUEST).json(prepareErrors(error));
    return;
  }

  for (const categoryId of newArticle.categories) {
    try {
      const isCategoryExist = await categoryService.checkExistence(categoryId);

      if (!isCategoryExist) {
        throw new Error(`Как минимум одна выбранная категория не существует`);
      }
    } catch (categoryError) {
      res.status(HttpCode.BAD_REQUEST).json({
        categories: categoryError.message,
      });
      return;
    }
  }

  next();
};

module.exports = articleValidator;
