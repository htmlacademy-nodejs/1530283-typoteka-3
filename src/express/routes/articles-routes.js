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
  }
});

const upload = multer({storage});

articlesRoutes.get(`/category/:categoryId`, async (req, res) =>{
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

articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res) => {
  let newArticle;

  try {
    try {
      const {body, file} = req;
      newArticle = parseClientArticle(body, file);

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

articlesRoutes.get(`/edit/:articleId`, async (req, res) => {
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
    throw error;
  }
});

articlesRoutes.get(`/:articleId`, async (req, res) => {
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(req.params.articleId),
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
