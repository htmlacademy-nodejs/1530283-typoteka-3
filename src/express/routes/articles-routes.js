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

articlesRoutes.get(`/category/:id`, async (req, res) =>{
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles(),
      api.getCategories(),
    ]);

    res.render(`articles/articles-by-category`, {
      user: {},
      articles: articles.map(getArticleTemplateData),
      categories
    });
  } catch (error) {
    throw error;
  }
}

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
    const [article, categories] = await Promise.all([
      api.getArticle(req.params.id),
      api.getCategories(),
    ]);

    res.render(`articles/article`, {
      user: {},
      article: getArticleTemplateData(article),
      categories
    });
  } catch (error) {
    throw error;
  }
});

module.exports = articlesRoutes;
