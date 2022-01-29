"use strict";

const chalk = require(`chalk`);
const express = require(`express`);

const {HttpCode} = require(`../../constants`);
const articlesRoutes = require(`./routes/articles-routes`);

const DEFAULT_PORT = 3000;
const Messages = {
  NOT_FOUND_MESSAGE: `Ресурс не найден`,
  SERVER_ERROR_MESSAGE: `Ошибка сервера`,
};

const sendNotFoundResponse = (req, res) => {
  res.status(HttpCode.NOT_FOUND).send(Messages.NOT_FOUND_MESSAGE);
};

const sendServerErrorResponse = (err, req, res, next) => {
  res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .send(Messages.SERVER_ERROR_MESSAGE);
  next();
};

const app = express();

app.use(express.json());

app.use(`/articles`, articlesRoutes);

app.use(sendNotFoundResponse);
app.use(sendServerErrorResponse);

module.exports = {
  name: `--server`,
  run(args) {
    const [rawPort] = args;
    const port = Number.parseInt(rawPort, 10) || DEFAULT_PORT;

    app.listen(port, () =>
      console.log(chalk.green(`Сервер запущен на порту: ${port}`))
    );
  },
};
