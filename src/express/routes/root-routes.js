"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const {parseClientUser} = require(`../../utils/user`);
const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);

const rootRoutes = new Router();
const api = getAPI();

const DEFAULT_ARTICLES_PAGE = 1;
const ARTICLES_LIMIT = 8;
const MOST_COMMENTED_ARTICLES_LIMIT = 4;
const LATEST_COMMENTS_LIMIT = 4;

rootRoutes.get(`/`, async (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_ARTICLES_PAGE;

  try {
    const [articles, mostCommentedArticles, categories, latestComments] =
      await Promise.all([
        api.getAndCountArticles({
          withCategories: true,
          limit: ARTICLES_LIMIT,
          offset: (page - 1) * ARTICLES_LIMIT,
        }),
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
      mostCommentedArticles: mostCommentedArticles.rows.map(
          getArticleTemplateData
      ),
      latestComments: latestComments.map(getCommentTemplateData),
      page,
      totalPages: Math.ceil(articles.count / ARTICLES_LIMIT),
      withPagination: articles.count > ARTICLES_LIMIT
    });
  } catch (error) {
    next(error);
  }
});

rootRoutes.get(`/register`, (_req, res) => res.render(`auth/register`, {
  registerFormData: {},
  registerFormErrors: {}
}));

rootRoutes.post(`/register`, upload.single(`upload`), async (req, res, next) => {
  const {body, file} = req;
  console.log(body);
  console.log(file);
  const userData = parseClientUser(body, file);

  console.log(userData);

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
      registerFormErrors: response.data
    });
  }
});

rootRoutes.get(`/login`, (_req, res) => res.render(`auth/login`));

rootRoutes.get(`/search`, async (req, res, next) => {
  const {query} = req.query;

  try {
    const articles = await api.search(query);

    res.render(`articles/search`, {
      articles: articles.map(getArticleTemplateData),
      query,
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
      });
      return;
    }

    if (error.response.status === HttpCode.NOT_FOUND) {
      res.render(`articles/search`, {
        articles: [],
        query,
      });
      return;
    }

    next(error);
  }
});

module.exports = rootRoutes;
