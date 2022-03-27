"use strict";

const {ensureArray} = require(`./common`);
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
