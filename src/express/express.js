"use strict";

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);

const {HttpCode, HttpMethod} = require(`../constants`);

const helmet = require(`./lib/helmet`);
const {session} = require(`./lib/session`);

const rootRoutes = require(`./routes/root-routes`);
const errorRoutes = require(`./routes/error-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);

const PORT = 8080;

const Dir = {
  TEMPLATES: `templates`,
  PUBLIC: `public`,
  UPLOAD: `upload`,
};

const handleClientError = (req, res) => {
  if (req.method !== HttpMethod.GET) {
    res.status(HttpCode.NOT_FOUND).end();
    return;
  }

  res.redirect(`/404`);
};

const handleServerError = (err, req, res, _next) => {
  if (err.response && err.response.status === HttpCode.NOT_FOUND) {
    handleClientError(req, res);
    return;
  }

  console.error(chalk.red(`Request failed with error: ${err.message}`));
  res.redirect(`/500`);
};

const app = express();

app.use(session);

app.use(helmet);

app.set(`views`, path.resolve(__dirname, Dir.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));

app.use(`/`, rootRoutes);
app.use(`/`, errorRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use(handleClientError);
app.use(handleServerError);

app.listen(PORT, (err) => {
  if (err) {
    console.error(
        chalk.red(`An error occurred on server creation: ${err.message}`)
    );
    return;
  }

  console.info(chalk.green(`Сервер запущен на порту: ${PORT}`));
});
