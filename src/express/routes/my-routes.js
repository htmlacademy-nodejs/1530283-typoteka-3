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
    const articles = await api.getArticles();

    res.render(`admin/articles`, {
      user: {
        isAdmin: true,
      },
      articles: articles.map(getArticleTemplateData),
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
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.post(`/categories`, upload.none(), async (req, res, next) => {
  try {
    await api.createCategory(req.body);

    res.redirect(`/my/categories`);
  } catch (error) {
    next(error);
  }
});

myRoutes.put(
    `/categories/:categoryId`,
    upload.none(),
    async (req, res) => {
      try {
        const updatedCategory = await api.updateCategory({
          id: req.params.categoryId,
          data: req.body,
        });

        res.json(updatedCategory);
      } catch (error) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
      }
    }
);

myRoutes.delete(
    `/categories/:categoryId`,
    async (req, res) => {
      try {
        await api.deleteCategory(req.params.categoryId);

        res.status(HttpCode.NO_CONTENT).end();
      } catch (error) {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
      }
    }
);


module.exports = myRoutes;
