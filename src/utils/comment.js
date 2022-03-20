"use strict";

const {formatCommentDate, formatCEODate} = require(`./date`);

const getCommentTemplateData = (comment) => ({
  ...comment,
  createdDate: formatCommentDate(comment.createdAt),
  createdCEODate: formatCEODate(comment.createdAt),
});

module.exports = {
  getCommentTemplateData,
};
