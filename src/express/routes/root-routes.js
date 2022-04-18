"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit} = require(`../../constants`);

const {getAPI} = require(`../api`);

const {upload, guest} = require(`../middlewares`);

const {SESSION_COOKIE_NAME} = require(`../lib/session`);

const {parseClientUser} = require(`../../utils/user`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);

const rootRoutes = new Router();
const api = getAPI();

const DEFAULT_ARTICLES_PAGE = 1;

rootRoutes.get(`/`, async (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_ARTICLES_PAGE;

  try {
    const articles = await api.getAndCountArticles({
      withCategories: true,
      limit: Limit.ARTICLES_PAGE,
      offset: (page - 1) * Limit.ARTICLES_PAGE,
    });

    if (!articles.count) {
      res.render(`articles/no-articles`, {
        user: req.session.user,
      });
      return;
    }

    const [hotArticles, categories, lastComments] =
      await Promise.all([
        api.getAndCountArticles({
          limit: Limit.HOT_ARTICLES_SECTION,
          mostCommented: true,
        }),
        api.getCategories({
          withArticlesCount: true,
          havingArticles: true
        }),
        api.getComments({
          limit: Limit.LAST_COMMENTS_SECTION
        }),
      ]);

    res.render(`articles/all-articles`, {
      articles: articles.rows.map(getArticleTemplateData),
      categories,
      hotArticles: hotArticles.rows.map((article) =>
        getArticleTemplateData(article, {
          truncate: true
        }),
      ),
      lastComments: lastComments.map((comment) =>
        getCommentTemplateData(comment, {
          truncate: true
        }),
      ),
      page,
      totalPages: Math.ceil(articles.count / Limit.ARTICLES_PAGE),
      withPagination: articles.count > Limit.ARTICLES_PAGE,
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
    currentPath: `/register`,
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
          currentPath: `/register`,
        });
      }
    },
);

rootRoutes.get(`/login`, guest(), (_req, res) => {
  return res.render(`auth/login`, {
    authFormData: {},
    authFormErrors: {},
    currentPath: `/login`,
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
      currentPath: `/login`,
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
