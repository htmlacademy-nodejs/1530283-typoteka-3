"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {SESSION_COOKIE_NAME} = require(`../lib/session`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const {parseClientUser} = require(`../../utils/user`);
const {getAPI} = require(`../api`);
const {upload, guest} = require(`../middlewares`);

const rootRoutes = new Router();
const api = getAPI();

const DEFAULT_ARTICLES_PAGE = 1;
const ARTICLES_LIMIT = 8;
const MOST_COMMENTED_ARTICLES_LIMIT = 4;
const LATEST_COMMENTS_LIMIT = 4;

rootRoutes.get(`/`, async (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_ARTICLES_PAGE;

  try {
    const articles = await api.getAndCountArticles({
      withCategories: true,
      limit: ARTICLES_LIMIT,
      offset: (page - 1) * ARTICLES_LIMIT,
    });

    if (!articles.count) {
      res.render(`articles/no-articles`, {
        user: req.session.user,
      });
      return;
    }

    const [mostCommentedArticles, categories, latestComments] =
      await Promise.all([
        api.getAndCountArticles({
          limit: MOST_COMMENTED_ARTICLES_LIMIT,
          mostCommented: true,
        }),
        api.getCategories({withArticlesCount: true, havingArticles: true}),
        api.getComments({limit: LATEST_COMMENTS_LIMIT}),
      ]);

    res.render(`articles/all-articles`, {
      articles: articles.rows.map(getArticleTemplateData),
      categories,
      mostCommentedArticles: mostCommentedArticles.rows.map((article) =>
        getArticleTemplateData(article, {truncate: true}),
      ),
      latestComments: latestComments.map((comment) =>
        getCommentTemplateData(comment, {truncate: true}),
      ),
      page,
      totalPages: Math.ceil(articles.count / ARTICLES_LIMIT),
      withPagination: articles.count > ARTICLES_LIMIT,
      user: req.session.user,
    });
  } catch (error) {
    next(error);
  }
});

rootRoutes.get(`/register`, guest(), (_req, res) =>
  res.render(`auth/register`, {
    registerFormData: {},
    registerFormErrors: {},
  }),
);

rootRoutes.post(
    `/register`,
    guest(),
    upload.single(`upload`),
    async (req, res, next) => {
      const {body, file} = req;
      const userData = parseClientUser(body, file);

      try {
        await api.createUser(userData);

        res.redirect(`/login`);
      } catch (error) {
        const {response} = error;

        if (!response || response.status !== HttpCode.BAD_REQUEST) {
          next(error);
        }

        res.render(`auth/register`, {
          registerFormData: userData,
          registerFormErrors: response.data,
        });
      }
    },
);

rootRoutes.get(`/login`, guest(), (_req, res) => {
  return res.render(`auth/login`, {
    authFormData: {},
    authFormErrors: {},
  });
});

rootRoutes.post(`/login`, guest(), async (req, res, next) => {
  const authData = req.body;

  try {
    const user = await api.auth(authData);

    req.session.user = user;

    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    const {response} = error;

    if (!response || response.status !== HttpCode.BAD_REQUEST) {
      next(error);
    }

    res.render(`auth/login`, {
      authFormData: authData,
      authFormErrors: response.data,
    });
  }
});

rootRoutes.get(`/logout`, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(SESSION_COOKIE_NAME);
    res.redirect(`login`);
  });
});

rootRoutes.get(`/search`, async (req, res, next) => {
  const {query} = req.query;

  try {
    const articles = await api.search(query);

    res.render(`articles/search`, {
      articles: articles.map(getArticleTemplateData),
      query,
      user: req.session.user,
    });
  } catch (error) {
    if (!error.response) {
      next(error);
      return;
    }

    if (error.response.status === HttpCode.BAD_REQUEST) {
      res.render(`articles/search`, {
        articles: null,
        query,
        user: req.session.user,
      });
      return;
    }

    if (error.response.status === HttpCode.NOT_FOUND) {
      res.render(`articles/search`, {
        articles: [],
        query,
        user: req.session.user,
      });
      return;
    }

    next(error);
  }
});

module.exports = rootRoutes;
