"use strict";

const {truncateText} = require(`./common`);
const {formatCommentDate, formatCEODate} = require(`./date`);

const TRUNCATED_TEXT_LENGTH = 100;

const getCommentTemplateData = (comment, {truncate} = {}) => ({
  ...comment,
  text: truncate ? truncateText(comment.text, TRUNCATED_TEXT_LENGTH) : comment.text,
  createdDate: formatCommentDate(comment.createdAt),
  createdCEODate: formatCEODate(comment.createdAt),
});

const parseClientComment = (comment) => ({
  text: comment.text,
});

module.exports = {
  getCommentTemplateData, parseClientComment
};
