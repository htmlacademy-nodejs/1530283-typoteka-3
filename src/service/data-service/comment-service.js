"use strict";

const {getId} = require(`../../utils/common`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll({limit}) {
    const comments = await this._Comment.findAll({
      attributes: [`id`, `text`, `createdAt`, `articleId`],
      include: [
        {
          model: this._Article,
          as: `article`,
          attributes: [`id`, `title`],
        },
        {
          model: this._User,
          as: `author`,
          attributes: [`id`, `firstName`, `lastName`, `avatar`],
        },
      ],
      order: [[`createdAt`, `DESC`]],
      limit: limit ? Number(limit) : undefined
    });

    return comments;
  }

  async findAllByArticleId(articleId) {
    const comments = await this._Comment.findAll({
      attributes: [`id`, `text`, `createdAt`],
      include: [
        {
          model: this._User,
          as: `author`,
          attributes: [`id`, `firstName`, `lastName`, `avatar`],
        },
      ],
      where: {
        articleId: Number(articleId),
      },
      order: [[`createdAt`, `DESC`]],
    });

    return comments;
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
    const commentIndex = article.comments.findIndex(
        (comment) => comment.id === commentId
    );

    if (commentIndex === -1) {
      return null;
    }

    const comment = article.comments[commentIndex];

    article.comments.splice(commentIndex, 1);

    return comment;
  }
}

module.exports = CommentService;
