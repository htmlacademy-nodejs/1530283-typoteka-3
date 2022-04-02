"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {prepareErrors} = require(`../../utils/common`);

const UserRestriction = {
  NAME_REGEX: /^[a-zA-Zа-яА-ЯёЁ ]+$/,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 72,
  PICTURE_EXTENSIONS: [`jpg`, `jpeg`, `png`],
};

const UserErrorMessage = {
  FIRST_NAME_EMPTY: `Введите имя`,
  FIRST_NAME_INVALID: `Имя не должно содержать цифр и специальных символов`,
  LAST_NAME_EMPTY: `Введите фамилию`,
  LAST_NAME_INVALID: `Фамилия не должна содержать цифр и специальных символов`,
  EMAIL_EMPTY: `Введите адрес электронной почты`,
  EMAIL_INVALID: `Введите корректный адрес электронной почты`,
  EMAIL_NON_UNIQUE: `Пользователь с такой электронной почтой уже существует`,
  PASSWORD_EMPTY: `Введите пароль`,
  PASSWORD_MIN: `Пароль должен содержать не менее ${UserRestriction.PASSWORD_MIN} символов`,
  PASSWORD_MAX: `Пароль должен содержать не более ${UserRestriction.PASSWORD_MAX} символов`,
  PASSWORD_MISMATCH: `Повтор пароля не совпадает`,
  AVATAR_EXTENSIONS: `Недопустимый тип файла фотографии. Допустимые типы ${UserRestriction.PICTURE_EXTENSIONS.map(
      (extension) => `*.${extension}`
  ).join(`, `)}`,
};

const schema = Joi.object({
  firstName: Joi.string().required().regex(UserRestriction.NAME_REGEX).messages({
    "string.empty": UserErrorMessage.FIRST_NAME_EMPTY,
    "string.pattern.base": UserErrorMessage.FIRST_NAME_INVALID,

  }),
  lastName: Joi.string().required().regex(UserRestriction.NAME_REGEX).messages({
    "string.empty": UserErrorMessage.LAST_NAME_EMPTY,
    "string.pattern.base": UserErrorMessage.LAST_NAME_INVALID,
  }),
  email: Joi.string().email().required().messages({
    "string.empty": UserErrorMessage.EMAIL_EMPTY,
    "string.email": UserErrorMessage.EMAIL_INVALID
  }),
  password: Joi.string()
    .required()
    .min(UserRestriction.PASSWORD_MIN)
    .max(UserRestriction.PASSWORD_MAX).messages({
      "string.empty": UserErrorMessage.PASSWORD_EMPTY,
      "string.min": UserErrorMessage.PASSWORD_MIN,
      "string.max": UserErrorMessage.PASSWORD_MAX
    }),
  passwordRepeated: Joi.any().valid(Joi.ref(`password`)).required().messages({
    'any.only': UserErrorMessage.PASSWORD_MISMATCH
  }),
  avatar: Joi.string()
    .allow(``)
    .custom((value, helper) => {
      if (!value) {
        return true;
      }

      const extension = value.split(`.`).pop();

      return (
        UserRestriction.PICTURE_EXTENSIONS.includes(extension) ||
        helper.message(UserErrorMessage.AVATAR_EXTENSIONS)
      );
    }),
});

const userValidator = (userService) => async (req, res, next) => {
  const newUser = req.body;

  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    res.status(HttpCode.BAD_REQUEST).json(prepareErrors(error));
    return;
  }

  const isNonUnique = Boolean(await userService.findByEmail(req.body.email));

  if (isNonUnique) {
    res.status(HttpCode.BAD_REQUEST).json({
      email: UserErrorMessage.EMAIL_NON_UNIQUE,
    });
    return;
  }

  next();
};

module.exports = userValidator;
