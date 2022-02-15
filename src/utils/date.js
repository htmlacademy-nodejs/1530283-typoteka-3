"use strict";

const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);

dayjs.extend(customParseFormat);

const parseArticleClientDate = (date) => dayjs(date, `DD-MM-YYYY`).toISOString();

const formatArticleDate = (date) => dayjs(date).format(`DD.MM.YYYY`);

const formatArticleCEODate = (date) => dayjs(date).format(`YYYY-MM-DD[T]hh:mm`);

module.exports = {
  formatArticleDate,
  formatArticleCEODate,
  parseArticleClientDate
};
