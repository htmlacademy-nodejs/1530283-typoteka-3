"use strict";

const {
  formatCEODate,
  formatArticleDate,
  parseArticleClientDate,
} = require(`./date`);

const getArticleTemplateData = (article) => ({
  ...article,
  createdDate: formatArticleDate(article.createdAt),
  createdCEODate: formatCEODate(article.createdAt),
});

const getInitialArticle = () => ({
  title: ``,
  announce: ``,
  fullText: ``,
  createdAt: new Date().toISOString(),
  categories: [],
});

const parseClientArticle = (clientArticle, file) => ({
  title: clientArticle.title,
  picture: file ? file.filename : clientArticle.filename,
  createdAt: parseArticleClientDate(clientArticle.date),
  categories: clientArticle.categories,
  announce: clientArticle.announce,
  fullText: clientArticle[`full-text`],
});

module.exports = {
  getArticleTemplateData,
  getInitialArticle,
  parseClientArticle,
};
