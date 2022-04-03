"use strict";

const {ensureArray, truncateText} = require(`./common`);
const {
  formatCEODate,
  formatArticleDate,
  parseArticleClientDate,
} = require(`./date`);

const TRUNCATED_ANNOUNCE_LENGTH = 100;

const getArticleTemplateData = (article, {truncate} = {}) => ({
  ...article,
  announce: truncate
    ? truncateText(article.announce, TRUNCATED_ANNOUNCE_LENGTH)
    : article.announce,
  createdDate: formatArticleDate(article.createdAt),
  createdCEODate: formatCEODate(article.createdAt),
});

const getInitialArticleFormData = () => ({
  title: ``,
  announce: ``,
  fullText: ``,
  createdAt: new Date().toISOString(),
  categories: [],
});

const getArticleFormData = (article) => ({
  ...article,
  categories: article.categories.map(({id}) => id),
});

const parseClientArticle = (clientArticle, file) => {
  const categories = clientArticle.categories
    ? ensureArray(clientArticle.categories).map((id) => Number(id))
    : [];

  return {
    title: clientArticle.title,
    picture: file ? file.filename : clientArticle.filename,
    createdAt: parseArticleClientDate(clientArticle.date),
    categories,
    announce: clientArticle.announce,
    fullText: clientArticle[`full-text`],
  };
};

module.exports = {
  getArticleTemplateData,
  getArticleFormData,
  getInitialArticleFormData,
  parseClientArticle,
};
