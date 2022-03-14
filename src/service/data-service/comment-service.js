"use strict";

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
      limit
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
        articleId,
      },
      order: [[`createdAt`, `DESC`]],
    });

    return comments;
  }

  async checkExistence(commentId) {
    return this._Comment.findByPk(commentId);
  }

  async create(commentData) {
    return await this._Comment.create(commentData);
  }

  async drop(commentId) {
    return await this._Comment.destroy({where: {
      id: commentId
    }});
  }
}

module.exports = CommentService;
