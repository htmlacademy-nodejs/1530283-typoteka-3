"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const {getAPI} = require(`../api`);
const {
  getArticleTemplateData,
  getInitialArticle,
  parseClientArticle,
} = require(`../../utils/article`);

const articlesRoutes = new Router();

const api = getAPI();

const upload = multer();

articlesRoutes.get(`/category/:id`, (req, res) =>
  res.render(`articles/articles-by-category`, {
    user: {},
  })
);

articlesRoutes.get(`/add`, async (_req, res) => {
  try {
    const categories = await api.getCategories();

    res.render(`admin/form`, {
      user: {
        isAdmin: true,
      },
      article: getInitialArticle(),
      categories,
      isNew: true,
    });
  } catch (error) {
    throw error;
  }
});

articlesRoutes.post(`/add`, upload.none(), async (req, res) => {
  let newArticle;

  try {
    try {
      newArticle = parseClientArticle(req.body);

      await api.createArticle(newArticle);

      res.redirect(`/my`);
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      const categories = await api.getCategories();

      res.render(`admin/form`, {
        user: {
          isAdmin: true,
        },
        article: newArticle,
        categories,
        isNew: true,
      });
    }
  } catch (error) {
    throw error;
  }
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(req.params.id),
      api.getCategories(),
    ]);

    res.render(`admin/form`, {
      user: {
        isAdmin: true,
      },
      article,
      categories,
    });
  } catch (error) {
    throw error;
  }
});

articlesRoutes.get(`/:id`, async (req, res) => {
  try {
    const article = await api.getArticle(req.params.id);

    res.render(`articles/article`, {
      user: {},
      article: getArticleTemplateData(article),
    });
  } catch (error) {
    throw error;
  }
});

module.exports = articlesRoutes;
