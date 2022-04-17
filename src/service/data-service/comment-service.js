"use strict";

const {Limit} = require(`../../constants`);

const Alias = require(`../models/alias`);

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
        as: Alias.AUTHOR,
        attributes: [`id`, `firstName`, `lastName`, `avatar`],
      },
    ];

    const whereArticleId = articleId
      ? {
        articleId,
      }
      : {};

    const includedModels = articleId
      ? basicIncludedModels
      : [
        ...basicIncludedModels,
        {
          model: this._Article,
          as: Alias.ARTICLE,
          attributes: [`id`, `title`],
        },
      ];

    const comments = await this._Comment.findAll({
      attributes: [`id`, `text`, `createdAt`, `articleId`],
      include: includedModels,
      order: [[`createdAt`, `DESC`]],
      where: whereArticleId,
      limit,
    });

    return comments.map((comment) => comment.get());
  }

  async findLastOnes() {
    return this.findAll({
      limit: Limit.LAST_COMMENTS_SECTION,
    });
  }

  async checkExistence(commentId) {
    return this._Comment.findByPk(commentId);
  }

  async create(commentData) {
    const createdComment = await this._Comment.create(commentData);

    return await this._Comment.findOne({
      attributes: [`id`, `text`, `createdAt`, `articleId`],
      include: {
        model: this._User,
        as: Alias.AUTHOR,
        attributes: [`id`, `firstName`, `lastName`, `avatar`],
      },
      where: {
        id: createdComment.id,
      },
    });
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
