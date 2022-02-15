"use strict";

const {formatArticleDate, formatArticleCEODate} = require(`./date`);

const getArticleTemplateData = (article) => ({
  ...article,
  createdDate: formatArticleDate(article.createdDate),
  createdCEODate: formatArticleCEODate(article.createdDate)
});

const getInitialArticle = () => ({
  title: ``,
  announce: ``,
  fullText: ``,
  createdDate: new Date().toISOString(),
  categories: []
});

module.exports = {
  getArticleTemplateData,
  getInitialArticle
};
