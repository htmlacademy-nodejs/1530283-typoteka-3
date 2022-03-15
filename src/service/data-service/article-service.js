"use strict";

const Sequelize = require(`sequelize`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.Category;
  }

  async findAll({limit, mostCommented, categoryId} = {}) {
    const articles = await this._Article.findAll({
      subQuery: false,
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
              Sequelize.fn(
                  `DISTINCT`,
                  Sequelize.fn(
                      `jsonb_build_object`,
                      `id`,
                      Sequelize.col(`categories.id`),
                      `name`,
                      Sequelize.col(`categories.name`)
                  )
              )
          ),
          `categoryList`,
        ],
      ],
      group: [Sequelize.col(`Article.id`)],
      include: [
        {
          model: this._Comment,
          as: `comments`,
          distinct: true,
          required: Boolean(mostCommented),
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
      order: [
        [
          mostCommented
            ? Sequelize.fn(
                `COUNT`,
                Sequelize.fn(`DISTINCT`, Sequelize.col(`comments.id`))
            )
            : `createdAt`,
          `DESC`,
        ],
      ],
      limit: limit ? Number(limit) : undefined,
      having: categoryId
        ? Sequelize.where(
            Sequelize.fn(
                `ARRAY_AGG`,
                Sequelize.fn(`DISTINCT`, Sequelize.col(`categories.id`))
            ),
            {
              [Sequelize.Op.contains]: [Number(categoryId)],
            }
        )
        : {},
    });

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
          attributes: [`id`, `name`]
        },
      ],
      where: {id: articleId},
    });

    return article.get();
  }

  async checkExistence(articleId) {
    await this._Article.findByPk(articleId);
  }

  async create(articleData) {
    const newArticle = await this._Article.create(articleData);

    await newArticle.setCategories(articleData.categories);

    return await this.findOne(newArticle.id);
  }

  async update(articleId, articleData) {
    await this._Article.update(articleData, {
      where: {id: articleId},
    });

    const updatedArticle = await this._Article.findOne({
      where: {id: articleId},
    });

    await updatedArticle.setCategories(articleData.categories);

    return await this.findOne(articleId);
  }

  async drop(articleId) {
    return await this._Article.destroy({
      where: {id: articleId},
    });
  }
}

module.exports = ArticleService;
