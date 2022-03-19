"use strict";

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll({limit, articleId}) {
    const basicIncludedModels = [
      {
        model: this._User,
        as: `author`,
        attributes: [`id`, `firstName`, `lastName`, `avatar`],
      },
    ];

    const whereArticleId = articleId
      ? {
        articleId,
      }
      : {};

    const includedModels = articleId
      ? [
        ...basicIncludedModels,
        {
          model: this._Article,
          as: `article`,
          attributes: [`id`, `title`],
        },
      ]
      : basicIncludedModels;

    const comments = await this._Comment.findAll({
      attributes: [`id`, `text`, `createdAt`, `articleId`],
      include: includedModels,
      order: [[`createdAt`, `DESC`]],
      where: whereArticleId,
      limit,
    });

    return comments.map((comment) => comment.get());
  }

  async checkExistence(commentId) {
    return this._Comment.findByPk(commentId);
  }

  async create(commentData) {
    return await this._Comment.create(commentData);
  }

  async drop(commentId) {
    return await this._Comment.destroy({
      where: {
        id: commentId,
      },
    });
  }
}

module.exports = CommentService;
