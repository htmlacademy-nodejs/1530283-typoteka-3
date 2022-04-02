"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const passwordService = require(`../lib/password-service`);
const userValidator = require(`../middlewares/user-validator`);

module.exports = (app, userService) => {
  const userRoutes = new Router();

  app.use(`/user`, userRoutes);

  userRoutes.post(`/`, userValidator(userService), async (req, res, next) => {
    try {
      const userData = req.body;

      userData.passwordHash = await passwordService.hash(userData.password);

      const createdUser = await userService.create(userData);

      delete createdUser.passwordHash;

      res.status(HttpCode.CREATED)
        .json(createdUser);
    } catch (error) {
      next(error);
    }
  });
};
