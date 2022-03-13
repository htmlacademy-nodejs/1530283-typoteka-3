"use strict";

const {Router} = require(`express`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const {getAPI} = require(`../api`);
const multer = require(`multer`);
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

myRoutes.post(
    `/categories/:categoryId/update`,
    upload.none(),
    async (req, res, next) => {
      try {
        await api.updateCategory({
          id: req.params.categoryId,
          data: req.body,
        });

        res.redirect(`/my/categories`);
      } catch (error) {
        next(error);
      }
    }
);

myRoutes.post(
    `/categories/:categoryId/delete`,
    async (req, res, next) => {
      try {
        await api.deleteCategory(req.params.categoryId);

        res.redirect(`/my/categories`);
      } catch (error) {
        next(error);
      }
    }
);


module.exports = myRoutes;
