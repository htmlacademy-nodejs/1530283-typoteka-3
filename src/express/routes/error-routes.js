'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const articlesRoutes = new Router();

articlesRoutes.get(`/404`, (req, res) => res.render(`error`, {
  errorCode: HttpCode.NOT_FOUND,
  errorMessage: `Похоже ошиблись адресом`
}));

articlesRoutes.get(`/500`, (req, res) => res.render(`error`, {
  errorCode: HttpCode.INTERNAL_SERVER_ERROR,
  errorMessage: `Что-то пошло не так`,
  errorText: `Причин может быть много: сервер не выдержал нагрузку или в коде ошибка. Попробуйте повторить попытку позже.`
}));

module.exports = articlesRoutes;
