"use strict";

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const session = require(`express-session`);
const helmet = require(`helmet`);
const connectSessionSequelize = require(`connect-session-sequelize`);
const sequelize = require(`../service/lib/sequelize`);
const {HttpCode, HttpMethod} = require(`../constants`);
const rootRoutes = require(`./routes/root-routes`);
const errorRoutes = require(`./routes/error-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);

const {SESSION_SECRET} = process.env;
const PORT = 8080;
const Dir = {
  TEMPLATES: `templates`,
  PUBLIC: `public`,
  UPLOAD: `upload`,
};

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const SequelizeStore = connectSessionSequelize(session.Store);

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

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000, // todo: put in env variables
  checkExpirationInterval: 60000, // todo: put in env variables,
  tableName: `sessions`,
});

sequelize.sync({force: false});

app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false,
    })
);

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: [
            `'self' 'unsafe-eval'`,
            `https://unpkg.com/dayjs@1.8.21/dayjs.min.js`,
          ],
        },
      },
    })
);

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
