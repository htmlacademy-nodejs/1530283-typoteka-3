"use strict";

const dayjs = require(`dayjs`);

const formatArticleDate = (date) => dayjs(date).format(`DD.MM.YYYY`);

const formatArticleCEODate = (date) => dayjs(date).format(`YYYY-MM-DD[T]hh:mm`);

module.exports = {
  formatArticleDate,
  formatArticleCEODate
};
