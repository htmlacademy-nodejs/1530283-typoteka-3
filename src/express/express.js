'use strict';

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const rootRoutes = require(`./routes/root-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const {HttpCode} = require(`../constants`);

const PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, rootRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => res.render(`error`, {
  errorCode: HttpCode.NOT_FOUND,
  errorMessage: `Похоже ошиблись адресом`
}));

app.use((err, req, res, next) => {
  res.render(`error`, {
    errorCode: HttpCode.INTERNAL_SERVER_ERROR,
    errorMessage: `Что-то пошло не так`,
    errorText: `Причин может быть много: сервер не выдержал нагрузку или в коде ошибка. Попробуйте повторить попытку позже.`
  });
  next();
});

app.listen(PORT,
    () => console.log(chalk.green(`Сервер запущен на порту: ${PORT}`)));
