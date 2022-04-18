"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit} = require(`../../constants`);

const {getAPI} = require(`../api`);

const csrf = require(`../lib/csrf`);

const {upload, admin, auth} = require(`../middlewares`);

const {
  getArticleTemplateData,
  getArticleFormData,
  getInitialArticleFormData,
  parseClientArticle,
} = require(`../../utils/article`);
const {getCommentTemplateData, parseClientComment} = require(`../../utils/comment`);

const DEFAULT_ARTICLES_PAGE = 1;

const articlesRoutes = new Router();

const api = getAPI();

articlesRoutes.get(`/category/:categoryId`, async (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_ARTICLES_PAGE;

  try {
    const [articles, categories] = await Promise.all([
      api.getAndCountArticles({
        categoryId: req.params.categoryId,
        withCategories: true,
        limit: Limit.ARTICLES_PAGE,
        offset: (page - 1) * Limit.ARTICLES_PAGE,
      }),
      api.getCategories({
        withArticlesCount: true,
        havingArticles: true,
      }),
    ]);

    const currentCategoryId = Number(req.params.categoryId);
    const currentCategory = categories.find((category) => category.id === currentCategoryId);

    res.render(`articles/articles-by-category`, {
      user: req.session.user,
      articles: articles.rows.map(getArticleTemplateData),
      categories,
      currentCategory,
      page,
      totalPages: Math.ceil(articles.count / Limit.ARTICLES_PAGE),
      withPagination: articles.count > Limit.ARTICLES_PAGE,
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.get(`/add`, admin(), csrf(), async (req, res, next) => {
  try {
    const categories = await api.getCategories();

    res.render(`admin/form`, {
      user: req.session.user,
      articleFormData: getInitialArticleFormData(),
      articleFormErrors: {},
      categories,
      csrfToken: req.csrfToken(),
      isNew: true,
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.post(`/add`, admin(), upload.single(`upload`), csrf(), async (req, res, next) => {
  try {
    const {body, file} = req;
    const newArticle = parseClientArticle(body, file);

    try {
      await api.createArticle({
        ...newArticle,
        authorId: req.session.user.id,
      });

      res.redirect(`/my`);
    } catch (error) {
      const {response} = error;

      if (!response || response.status !== HttpCode.BAD_REQUEST) {
        next(error);
      }

      const categories = await api.getCategories();

      res.render(`admin/form`, {
        user: req.session.user,
        articleFormData: newArticle,
        articleFormErrors: response.data,
        categories,
        csrfToken: req.csrfToken(),
        isNew: true,
      });
    }
  } catch (error) {
    next(error);
  }
});

articlesRoutes.get(`/edit/:articleId`, admin(), csrf(), async (req, res, next) => {
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(req.params.articleId),
      api.getCategories(),
    ]);

    res.render(`admin/form`, {
      user: req.session.user,
      articleFormData: getArticleFormData(article),
      articleFormErrors: {},
      categories,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.post(
    `/edit/:articleId`,
    admin(),
    upload.single(`upload`),
    csrf(),
    async (req, res, next) => {
      try {
        const {body, file} = req;
        const updatedArticle = parseClientArticle(body, file);

        try {
          await api.updateArticle({
            id: req.params.articleId,
            data: updatedArticle,
          });

          res.redirect(`/my`);
        } catch (error) {
          const {response} = error;

          if (!response || response.status !== HttpCode.BAD_REQUEST) {
            next(error);
          }

          const categories = await api.getCategories();

          res.render(`admin/form`, {
            user: req.session.user,
            articleFormData: updatedArticle,
            articleFormErrors: response.data,
            categories,
            isNew: true,
            csrfToken: req.csrfToken(),
          });
        }
      } catch (error) {
        next(error);
      }
    }
);

articlesRoutes.get(`/:articleId`, csrf(), async (req, res, next) => {
  try {
    const [article, categories, comments] = await Promise.all([
      api.getArticle(req.params.articleId),
      api.getCategories({
        withArticlesCount: true,
        articleId: req.params.articleId,
      }),
      api.getComments({
        articleId: req.params.articleId
      }),
    ]);

    res.render(`articles/article`, {
      user: req.session.user,
      article: getArticleTemplateData(article),
      categories,
      comments: comments.map(getCommentTemplateData),
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.post(
    `/:articleId/comments`,
    auth(),
    csrf(),
    async (req, res) => {
      const {articleId} = req.params;
      const newComment = parseClientComment(req.body);

      try {
        const createdComment = await api.createComment({
          articleId,
          data: {
            ...newComment,
            authorId: req.session.user.id,
          },
        });

        res.status(HttpCode.CREATED).json(createdComment);
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
    }
);

module.exports = articlesRoutes;
