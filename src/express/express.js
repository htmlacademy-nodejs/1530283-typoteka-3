'use strict';

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const rootRoutes = require(`./routes/root-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const {sendNotFound} = require(`../utils`);

const PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, rootRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(sendNotFound);

app.listen(PORT,
    () => console.log(chalk.green(`Сервер запущен на порту: ${PORT}`)));
