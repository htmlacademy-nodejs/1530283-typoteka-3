"use strict";

const {Router} = require(`express`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const {getAPI} = require(`../api`);
const multer = require(`multer`);
const {HttpCode} = require(`../../constants`);
const upload = multer();

const myRoutes = new Router();
const api = getAPI();

myRoutes.get(`/`, async (_req, res, next) => {
  try {
    const articles = await api.getAndCountArticles();

    res.render(`admin/articles`, {
      user: {
        isAdmin: true,
      },
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

myRoutes.get(`/comments`, async (_req, res, next) => {
  try {
    const comments = await api.getComments();

    res.render(`admin/comments`, {
      user: {
        isAdmin: true,
      },
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

myRoutes.get(`/categories`, async (_req, res, next) => {
  try {
    const categories = await api.getCategories({withArticlesCount: true});

    res.render(`admin/categories`, {
      user: {
        isAdmin: true,
      },
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
    await api.createCategory(addCategoryFormData);

    res.redirect(`/my/categories`);
  } catch (error) {
    const {response} = error;

    if (!response || response.status !== HttpCode.BAD_REQUEST) {
      next(error);
      return;
    }

    try {
      const categories = await api.getCategories({withArticlesCount: true});

      res.render(`admin/categories`, {
        user: {
          isAdmin: true,
        },
        categories,
        addCategoryFormData,
        addCategoryFormErrors: response.data
      });
    } catch (secondaryError) {
      next(secondaryError);
    }
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
