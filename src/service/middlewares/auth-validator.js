"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const passwordService = require(`../lib/password-service`);
const {prepareErrors} = require(`../../utils/common`);

const AuthErrorMessage = {
  EMAIL_EMPTY: `Введите адрес электронной почты`,
  PASSWORD_EMPTY: `Введите пароль`,
  PASSWORD_INCORRECT: `Неверный пароль`, // todo: change to auth_failed
  USER_EMPTY: `Пользователь не найден`, // todo: change to auth_failed
  AUTH_FAILED: `Неправильная электронная почта или пароль`
};

const schema = Joi.object({
  email: Joi.string().required().messages({
    "string.empty": AuthErrorMessage.EMAIL_EMPTY,
  }),
  password: Joi.string()
    .required()
    .messages({
      "string.empty": AuthErrorMessage.PASSWORD_EMPTY,
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
      email: AuthErrorMessage.USER_EMPTY, // todo: change to auth_failed
    });
    return;
  }

  const passwordIsCorrect = await passwordService.compare(authData.password, user.passwordHash);

  if (!passwordIsCorrect) {
    res.status(HttpCode.BAD_REQUEST).json({
      email: AuthErrorMessage.PASSWORD_INCORRECT, // todo: change to auth_failed
    });
    return;
  }

  delete user.passwordHash;

  req.locals = user;

  next();
};

module.exports = authValidator;
