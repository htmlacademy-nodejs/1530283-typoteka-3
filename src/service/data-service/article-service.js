"use strict";

const Sequelize = require(`sequelize`);
const {getId} = require(`../../utils/common`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.Category;
  }

  async findAll() {
    let articles = await this._Article.findAll({
      attributes: [
        `id`,
        `title`,
        `announce`,
        `createdAt`,
        `picture`,
        // [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `commentsCount`],
        // [Sequelize.fn(`COUNT`, Sequelize.col(`categories.id`)), `categoriesCount`],
      ],
      // group: [Sequelize.col(`Article.id`)],
      include: [
        {
          model: this._Comment,
          as: `comments`,
          required: false,
          attributes: [`id`],
          duplicating: false
        },
        {
          model: this._Category,
          as: `categories`,
          attributes: [`id`, `name`],
          duplicating: false
        },
      ],
    });

    // console.log(articles);

    return articles.map((article) => article.get());
  }

  async findOne(articleId) {
    return await this._Article.findOne({
      where: {id: articleId},
      include: [
        {
          model: this._Comment,
          as: `comments`,
          attributes: [`id`],
        },
        {
          model: this._Category,
          as: `categories`,
          attributes: [`id`, `name`],
        },
      ],
    });
  }

  create(article) {
    const newArticle = Object.assign(
        {
          id: getId(),
          comments: [],
        },
        article
    );

    this._articles.push(newArticle);
    return newArticle;
  }

  update(oldArticle, newArticle) {
    return Object.assign(oldArticle, newArticle);
  }

  drop(articleId) {
    const articleIndex = this._articles.findIndex(
        (article) => article.id === articleId
    );

    this._articles.splice(articleIndex, 1);
  }
}

module.exports = ArticleService;
