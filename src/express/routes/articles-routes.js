"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {
  getArticleTemplateData,
  getArticleFormData,
  getInitialArticleFormData,
  parseClientArticle,
} = require(`../../utils/article`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const upload = require(`../middlewares/upload`);

const {HttpCode} = require(`../../constants`);

const DEFAULT_ARTICLES_PAGE = 1;
const ARTICLES_LIMIT = 8;

const AUTHOR_ID = 1;

const articlesRoutes = new Router();

const api = getAPI();

articlesRoutes.get(`/category/:categoryId`, async (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : DEFAULT_ARTICLES_PAGE;

  try {
    const [articles, categories] = await Promise.all([
      api.getAndCountArticles({
        categoryId: req.params.categoryId,
        withCategories: true,
        limit: ARTICLES_LIMIT,
        offset: (page - 1) * ARTICLES_LIMIT,
      }),
      api.getCategories({withArticlesCount: true, havingArticles: true}),
    ]);

    res.render(`articles/articles-by-category`, {
      user: {},
      articles: articles.rows.map(getArticleTemplateData),
      categories,
      currentCategoryId: Number(req.params.categoryId),
      page,
      totalPages: Math.ceil(articles.count / ARTICLES_LIMIT),
      withPagination: articles.count > ARTICLES_LIMIT
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
      articleFormData: getInitialArticleFormData(),
      articleFormErrors: {},
      categories,
      isNew: true,
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res, next) => {
  try {
    const {body, file} = req;
    const newArticle = parseClientArticle(body, file);

    try {
      await api.createArticle({
        ...newArticle,
        authorId: AUTHOR_ID,
      });

      res.redirect(`/my`);
    } catch (error) {
      const {response} = error;

      if (!response || response.status !== HttpCode.BAD_REQUEST) {
        next(error);
      }

      const categories = await api.getCategories();

      res.render(`admin/form`, {
        user: {
          isAdmin: true,
        },
        articleFormData: newArticle,
        articleFormErrors: response.data,
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
      articleFormData: getArticleFormData(article),
      articleFormErrors: {},
      categories,
    });
  } catch (error) {
    next(error);
  }
});

articlesRoutes.post(
    `/edit/:articleId`,
    upload.single(`upload`),
    async (req, res, next) => {
      try {
        const {body, file} = req;
        const updatedArticle = parseClientArticle(body, file);

        try {
          await api.updateArticle({
            id: req.params.articleId,
            data: {
              ...updatedArticle,
              authorId: AUTHOR_ID,
            },
          });

          res.redirect(`/my`);
        } catch (error) {
          const {response} = error;

          if (!response || response.status !== HttpCode.BAD_REQUEST) {
            next(error);
          }

          const categories = await api.getCategories();

          res.render(`admin/form`, {
            user: {
              isAdmin: true,
            },
            articleFormData: updatedArticle,
            articleFormErrors: response.data,
            categories,
            isNew: true,
            error: true
          });
        }
      } catch (error) {
        next(error);
      }
    }
);

articlesRoutes.get(`/:articleId`, async (req, res, next) => {
  try {
    const [article, categories, comments] = await Promise.all([
      api.getArticle(req.params.articleId),
      api.getCategories({
        withArticlesCount: true,
        articleId: req.params.articleId,
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

articlesRoutes.post(
    `/:articleId/comments`,
    upload.none(),
    async (req, res) => {
      const {articleId} = req.params;

      try {
        const createdComment = await api.createComment({
          articleId,
          data: {
            ...req.body,
            authorId: AUTHOR_ID,
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
