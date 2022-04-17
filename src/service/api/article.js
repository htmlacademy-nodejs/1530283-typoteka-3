"use strict";

const {Router} = require(`express`);

const {HttpCode, Limit} = require(`../../constants`);

const articleComment = require(`./article-comment`);

const {articleValidator, instanceExists, routeParamsValidator} = require(`../middlewares`);
const {SocketEvent} = require(`../../constants`);
const {getCommentTemplateData} = require(`../../utils/comment`);
const {getArticleTemplateData} = require(`../../utils/article`);

module.exports = (app, articleService, commentService, categoryService) => {
  const articlesRoutes = new Router();

  app.use(`/articles`, articlesRoutes);

  articlesRoutes.use(`/:articleId`, routeParamsValidator, instanceExists(articleService, `articleId`));

  articleComment(articlesRoutes, articleService, commentService);

  articlesRoutes.get(`/`, async (req, res, next) => {
    try {
      const {limit, offset, mostCommented, withCategories, categoryId} = req.query;

      const articles = await articleService.findAndCountAll({
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        mostCommented: Boolean(mostCommented),
        withCategories: Boolean(withCategories),
        categoryId: categoryId ? Number(categoryId) : undefined,
      });

      res.status(HttpCode.OK).json(articles);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.get(`/:articleId`, async (req, res, next) => {
    try {
      const article = await articleService.findOne(req.params.articleId);

      res.status(HttpCode.OK).json(article);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.post(`/`, articleValidator(categoryService), async (req, res, next) => {
    try {
      const newArticle = await articleService.create(req.body);

      res.status(HttpCode.CREATED).json(newArticle);
    } catch (error) {
      next(error);
    }
  });

  articlesRoutes.put(
      `/:articleId`,
      articleValidator(categoryService),
      async (req, res, next) => {
        try {
          const updatedArticle = await articleService.update(
              Number(req.params.articleId),
              req.body
          );

          res.status(HttpCode.OK).json(updatedArticle);
        } catch (error) {
          next(error);
        }
      }
  );

  articlesRoutes.delete(`/:articleId`, async (req, res, next) => {
    try {
      const articleId = Number(req.params.articleId);

      // todo: get latest comments before article deletion.DONE
      // todo: get most commented before article deletion.DONE
      const [hotArticles, lastComments] = await Promise.all([
        articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.HOT_ARTICLES_SECTION,
        }),
        commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        }),
      ]);

      await articleService.drop(articleId);

      const {socket} = req.app.locals;

      const isLastCommentsAffected = lastComments.some((comment) => comment.articleId === articleId);
      const isHotArticlesAffected = hotArticles.rows.some((article) => article.id === articleId);

      // todo: if last comments before deletion had comments with articleId - get new latest comments and emit `latest-comments:update`. DONE
      if (isLastCommentsAffected) {
        const updatedLastComments = await commentService.findAll({
          limit: Limit.LAST_COMMENTS_SECTION,
        });

        socket.emit(SocketEvent.LAST_COMMENTS_UPDATE, updatedLastComments.map((comment) =>
          getCommentTemplateData(comment, {
            truncate: true
          }),
        ));
      }

      // todo: if most commented before deletion had articleId - get new most commented and emit `most-commented:update`. DONE
      if (isHotArticlesAffected) {
        const hotArticlesUpdated = await articleService.findAndCountAll({
          mostCommented: true,
          limit: Limit.HOT_ARTICLES_SECTION,
        });

        socket.emit(SocketEvent.HOT_ARTICLES_UPDATE, hotArticlesUpdated.rows.map((comment) =>
          getArticleTemplateData(comment, {
            truncate: true
          }),
        ));
      }

      res.status(HttpCode.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  });
};
