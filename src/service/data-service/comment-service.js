"use strict";

const {getId} = require(`../../utils`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(articleId) {
    const article = this._articles.find(({id}) => id === articleId);

    return article.comments;
  }

  create(articleId, comment) {
    const articleIndex = this._articles.findIndex(({id}) => id === articleId);
    const newComment = Object.assign(
        {
          id: getId(),
        },
        comment
    );

    this._articles[articleIndex].comments.push(newComment);
    return newComment;
  }

  drop(article, commentId) {
    const commentIndex = article.comments.findIndex((comment) => comment.id === commentId);

    if (commentIndex === -1) {
      return null;
    }

    const comment = article.comments[commentIndex];

    article.comments.splice(commentIndex, 1);

    return comment;
  }
}

module.exports = CommentService;
