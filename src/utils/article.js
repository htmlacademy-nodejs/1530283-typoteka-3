"use strict";

const {formatArticleDate, formatArticleCEODate} = require(`./date`);

const getArticleTemplateData = (article) => ({
  ...article,
  createdDate: formatArticleDate(article.createdDate),
  createdCEODate: formatArticleCEODate(article.createdDate)
});

module.exports = {
  getArticleTemplateData
};
