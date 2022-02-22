"use strict";

const dayjs = require(`dayjs`);
const customParseFormat = require(`dayjs/plugin/customParseFormat`);

const {getRandomInt} = require(`./common`);

dayjs.extend(customParseFormat);

const MINUTES_IN_DAY = 60 * 24;

const getRandomPastDate = (daysBefore) => {
  const minutesBefore = getRandomInt(0, MINUTES_IN_DAY);
  return dayjs().subtract(daysBefore - 1, `day`).subtract(minutesBefore, `minutes`);
};

const formatTimestamp = (timestamp) => dayjs(timestamp).toISOString();

const parseArticleClientDate = (date) => dayjs(date, `DD-MM-YYYY`).toISOString();

const formatArticleDate = (date) => dayjs(date).format(`DD.MM.YYYY`);

const formatArticleCEODate = (date) => dayjs(date).format(`YYYY-MM-DD[T]hh:mm`);

module.exports = {
  formatTimestamp,
  getRandomPastDate,
  formatArticleDate,
  formatArticleCEODate,
  parseArticleClientDate,
};
