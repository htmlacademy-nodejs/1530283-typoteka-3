"use strict";

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);

const {helmet} = require(`./lib/helmet`);
const {session} = require(`./lib/session`);

const clientError = require(`./middlewares/client-error`);
const serverError = require(`./middlewares/server-error`);

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

const app = express();

app.use(session);

app.use(helmet);

app.use(express.urlencoded({extended: false}));

app.set(`views`, path.resolve(__dirname, Dir.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));

app.use(`/`, rootRoutes);
app.use(`/`, errorRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use(clientError);
app.use(serverError);

app.listen(PORT, (err) => {
  if (err) {
    console.error(
        chalk.red(`An error occurred on server creation: ${err.message}`)
    );
    return;
  }

  console.info(chalk.green(`Сервер запущен на порту: ${PORT}`));
});
