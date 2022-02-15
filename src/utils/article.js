"use strict";

const {
  formatArticleDate,
  formatArticleCEODate,
  parseArticleClientDate,
} = require(`./date`);

const getArticleTemplateData = (article) => ({
  ...article,
  createdDate: formatArticleDate(article.createdDate),
  createdCEODate: formatArticleCEODate(article.createdDate),
});

const getInitialArticle = () => ({
  title: ``,
  announce: ``,
  fullText: ``,
  createdDate: new Date().toISOString(),
  categories: [],
});

const parseClientArticle = (clientArticle) => ({
  title: clientArticle.title,
  createdDate: parseArticleClientDate(clientArticle.date),
  categories: clientArticle.categories,
  announce: clientArticle.announce,
  fullText: clientArticle[`full-text`],
});

module.exports = {
  getArticleTemplateData,
  getInitialArticle,
  parseClientArticle,
};
