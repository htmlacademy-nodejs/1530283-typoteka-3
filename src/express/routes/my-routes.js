"use strict";

const {Router} = require(`express`);
const multer = require(`multer`);
const {getAPI} = require(`../api`);
const {HttpCode} = require(`../../constants`);
const admin = require(`../middlewares/admin`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);

const upload = multer();

const myRoutes = new Router();
const api = getAPI();

myRoutes.use(admin);

myRoutes.get(`/`, async (req, res, next) => {
  try {
    const articles = await api.getAndCountArticles();

    res.render(`admin/articles`, {
      user: req.session.user,
      articles: articles.rows.map(getArticleTemplateData),
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.delete(`/articles/:articleId`, async (req, res) => {
  try {
    await api.deleteArticle(req.params.articleId);
    res.status(HttpCode.NO_CONTENT).end();
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

myRoutes.get(`/comments`, async (req, res, next) => {
  try {
    const comments = await api.getComments();

    res.render(`admin/comments`, {
      user: req.session.user,
      comments: comments.map(getCommentTemplateData),
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.delete(`/comments/:commentId`, async (req, res) => {
  try {
    await api.deleteComment(req.params.commentId);
    res.status(HttpCode.NO_CONTENT).end();
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

myRoutes.get(`/categories`, async (req, res, next) => {
  try {
    const categories = await api.getCategories({withArticlesCount: true});

    res.render(`admin/categories`, {
      user: req.session.user,
      categories,
      addCategoryFormData: {},
      addCategoryFormErrors: {}
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.post(`/categories`, upload.none(), async (req, res, next) => {
  const addCategoryFormData = req.body;

  try {
    try {
      await api.createCategory(addCategoryFormData);

      res.redirect(`/my/categories`);
    } catch (error) {
      const {response} = error;

      if (!response || response.status !== HttpCode.BAD_REQUEST) {
        next(error);
        return;
      }

      const categories = await api.getCategories({withArticlesCount: true});

      res.render(`admin/categories`, {
        user: req.session.user,
        categories,
        addCategoryFormData,
        addCategoryFormErrors: response.data
      });
    }
  } catch (error) {
    next(error);
  }
});

myRoutes.put(`/categories/:categoryId`, upload.none(), async (req, res) => {
  try {
    const updatedCategory = await api.updateCategory({
      id: req.params.categoryId,
      data: req.body,
    });

    res.json(updatedCategory);
  } catch (error) {
    const {response} = error;

    if (response) {
      res
        .set(response.headers)
        .status(response.status)
        .send(response.data)
        .end();
      return;
    }

    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

myRoutes.delete(`/categories/:categoryId`, async (req, res) => {
  try {
    await api.deleteCategory(req.params.categoryId);

    res.status(HttpCode.NO_CONTENT).end();
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = myRoutes;
