"use strict";

const path = require(`path`);
const {Router} = require(`express`);
const multer = require(`multer`);
const {getAPI} = require(`../api`);
const {
  getArticleTemplateData,
  getInitialArticle,
  parseClientArticle,
} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);

const {getImageFileName} = require(`../../utils/image`);

const UPLOAD_DIR = `../upload/img`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRoutes = new Router();

const api = getAPI();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, callback) => {
    const error = null;
    const fileName = getImageFileName(file);
    callback(error, fileName);
  },
});

const upload = multer({storage});

articlesRoutes.get(`/category/:categoryId`, async (req, res, next) => {
  try {
    const [articles, categories] = await Promise.all([
      api.getArticles({categoryId: req.params.categoryId}),
      api.getCategories({withArticlesCount: true, havingArticles: true}),
    ]);

    res.render(`articles/articles-by-category`, {
      user: {},
      articles: articles.map(getArticleTemplateData),
      categories,
      currentCategoryId: Number(req.params.categoryId),
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.get(`/add`, async (_req, res, next) => {
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
    next(error);
  }
});

articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res, next) => {
  let newArticle;

  try {
    try {
      const {body, file} = req;
      newArticle = parseClientArticle(body, file);

      await api.createArticle(newArticle);

      res.redirect(`/my`);
    } catch (error) {
      if (!error.response) {
        next(error);
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
    next(error);
  }
});

articlesRoutes.get(`/edit/:articleId`, async (req, res, next) => {
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(req.params.articleId),
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
    next(error);
  }
});

articlesRoutes.get(`/:articleId`, async (req, res, next) => {
  try {
    const [article, categories, comments] = await Promise.all([
      api.getArticle(req.params.articleId),
      api.getCategories({
        withArticlesCount: true,
        articleId: req.params.articleId
      }),
      api.getComments({articleId: req.params.articleId}),
    ]);

    res.render(`articles/article`, {
      user: {},
      article: getArticleTemplateData(article),
      categories,
      comments: comments.map(getCommentTemplateData),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = articlesRoutes;
