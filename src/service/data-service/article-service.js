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
        [
          Sequelize.fn(
              `COUNT`,
              Sequelize.fn(`DISTINCT`, Sequelize.col(`comments.id`))
          ),
          `commentsCount`,
        ],
        [
          Sequelize.fn(
              `ARRAY_AGG`,
              Sequelize.fn(`DISTINCT`, Sequelize.col(`categories.name`))
          ),
          `categoryNames`,
        ],
      ],
      group: [Sequelize.col(`Article.id`)],
      include: [
        {
          model: this._Comment,
          as: `comments`,
          required: false,
          attributes: [],
        },
        {
          model: this._Category,
          as: `categories`,
          through: {
            attributes: [],
          },
          attributes: [],
        },
      ],
    });

    console.log(articles.map((article) => article.get()));

    return articles.map((article) => article.get());
  }

  async findOne(articleId) {
    const article = await this._Article.findOne({
      attributes: [`title`, `fullText`, `announce`, `picture`, `createdAt`],
      include: [
        {
          model: this._Category,
          through: {attributes: []},
          as: `categories`,
        },
      ],
      where: {id: articleId},
    });

    return article.get();
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
