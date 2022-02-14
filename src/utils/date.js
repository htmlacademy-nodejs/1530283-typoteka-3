"use strict";

const dayjs = require(`dayjs`);

const formatArticleDate = (date) => dayjs(date).format(`DD.MM.YYYY, hh:mm`);

const formatArticleCEODate = (date) => dayjs(date).format(`YYYY-MM-DD[T]hh:mm`);

module.exports = {
  formatArticleDate,
  formatArticleCEODate
};
