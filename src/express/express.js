"use strict";

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const rootRoutes = require(`./routes/root-routes`);
const errorRoutes = require(`./routes/error-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);

const PORT = 8080;
const Dir = {
  TEMPLATES: `templates`,
  PUBLIC: `public`,
  UPLOAD: `upload`
};

const app = express();

app.set(`views`, path.resolve(__dirname, Dir.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));

app.use(`/`, rootRoutes);
app.use(`/`, errorRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((_req, res) => res.redirect(`/404`));

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.redirect(`/500`);
});

app.listen(PORT, () =>
  console.log(chalk.green(`Сервер запущен на порту: ${PORT}`))
);
