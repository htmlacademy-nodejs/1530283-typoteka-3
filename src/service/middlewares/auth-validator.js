"use strict";

const Joi = require(`joi`);

const {HttpCode} = require(`../../constants`);

const passwordService = require(`../lib/password-service`);

const {prepareErrors} = require(`../../utils/common`);

const AuthRestriction = {
  PASSWORD_MAX: 72,
};

const AuthErrorMessage = {
  EMAIL_EMPTY: `Введите адрес электронной почты`,
  EMAIL_INVALID: `Введите корректный адрес электронной почты`,
  PASSWORD_EMPTY: `Введите пароль`,
  PASSWORD_MAX: `Пароль должен содержать не более ${AuthRestriction.PASSWORD_MAX} символов`,
  AUTH_FAILED: `Неправильная электронная почта или пароль`
};

const schema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": AuthErrorMessage.EMAIL_EMPTY,
    "string.email": AuthErrorMessage.EMAIL_INVALID
  }),
  password: Joi.string()
    .required()
    .max(AuthRestriction.PASSWORD_MAX)
    .messages({
      "string.empty": AuthErrorMessage.PASSWORD_EMPTY,
      "string.max": AuthErrorMessage.PASSWORD_MAX,
    })
});

const authValidator = (userService) => async (req, res, next) => {
  const authData = req.body;

  const {error} = schema.validate(authData, {abortEarly: false});

  if (error) {
    res.status(HttpCode.BAD_REQUEST).json(prepareErrors(error));
    return;
  }

  const user = await userService.findByEmail(req.body.email);

  if (!user) {
    res.status(HttpCode.BAD_REQUEST).json({
      email: AuthErrorMessage.AUTH_FAILED,
    });
    return;
  }

  const passwordIsCorrect = await passwordService.compare(authData.password, user.passwordHash);

  if (!passwordIsCorrect) {
    res.status(HttpCode.BAD_REQUEST).json({
      email: AuthErrorMessage.AUTH_FAILED,
    });
    return;
  }

  delete user.passwordHash;

  req.locals = user;

  next();
};

module.exports = authValidator;
