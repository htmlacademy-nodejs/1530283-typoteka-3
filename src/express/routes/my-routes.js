"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);

const {getAPI} = require(`../api`);

const {admin} = require(`../middlewares`);

const csrf = require(`../lib/csrf`);

const {parseClientCategory} = require(`../../utils/category`);
const {getArticleTemplateData} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);

const myRoutes = new Router();

const api = getAPI();

myRoutes.use(admin());

myRoutes.get(`/`, csrf(), async (req, res, next) => {
  try {
    const articles = await api.getAndCountArticles();

    res.render(`admin/articles`, {
      user: req.session.user,
      articles: articles.rows.map(getArticleTemplateData),
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.delete(`/articles/:articleId`, csrf(), async (req, res) => {
  try {
    await api.deleteArticle(req.params.articleId);
    res.status(HttpCode.NO_CONTENT).end();
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

myRoutes.get(`/comments`, csrf(), async (req, res, next) => {
  try {
    const comments = await api.getComments();

    res.render(`admin/comments`, {
      user: req.session.user,
      comments: comments.map(getCommentTemplateData),
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.delete(`/comments/:commentId`, csrf(), async (req, res) => {
  try {
    await api.deleteComment(req.params.commentId);
    res.status(HttpCode.NO_CONTENT).end();
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

myRoutes.get(`/categories`, csrf(), async (req, res, next) => {
  try {
    const categories = await api.getCategories({
      withArticlesCount: true
    });

    res.render(`admin/categories`, {
      user: req.session.user,
      categories,
      addCategoryFormData: {},
      addCategoryFormErrors: {},
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
});

myRoutes.post(`/categories`, csrf(), async (req, res, next) => {
  const newCategoryDate = parseClientCategory(req.body);

  try {
    try {
      await api.createCategory(newCategoryDate);

      res.redirect(`/my/categories`);
    } catch (error) {
      const {response} = error;

      if (!response || response.status !== HttpCode.BAD_REQUEST) {
        next(error);
        return;
      }

      const categories = await api.getCategories({
        withArticlesCount: true
      });

      res.render(`admin/categories`, {
        user: req.session.user,
        categories,
        addCategoryFormData: newCategoryDate,
        addCategoryFormErrors: response.data,
        csrfToken: req.csrfToken(),
      });
    }
  } catch (error) {
    next(error);
  }
});

myRoutes.put(`/categories/:categoryId`, csrf(), async (req, res) => {
  const updatedCategoryData = parseClientCategory(req.body);

  try {
    const updatedCategory = await api.updateCategory({
      id: req.params.categoryId,
      data: updatedCategoryData,
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

myRoutes.delete(`/categories/:categoryId`, csrf(), async (req, res) => {
  try {
    await api.deleteCategory(req.params.categoryId);

    res.status(HttpCode.NO_CONTENT).end();
  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).end();
  }
});

module.exports = myRoutes;
