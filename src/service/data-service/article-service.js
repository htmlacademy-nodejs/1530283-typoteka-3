"use strict";

const Sequelize = require(`sequelize`);

const {Limit} = require(`../../constants`);

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async findAndCountAll({
    limit,
    mostCommented,
    categoryId,
    withCategories,
    offset,
  } = {}) {
    const baseAttributes = [
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
    ];

    const attributes = withCategories
      ? [
        ...baseAttributes,
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
          `categoryObjects`,
        ],
      ]
      : baseAttributes;

    const order = [
      [
        mostCommented
          ? Sequelize.fn(
              `COUNT`,
              Sequelize.fn(`DISTINCT`, Sequelize.col(`comments.id`))
          )
          : `createdAt`,
        `DESC`,
      ],
    ];

    const havingCategoryId = categoryId
      ? Sequelize.where(
          Sequelize.fn(
              `ARRAY_AGG`,
              Sequelize.fn(`DISTINCT`, Sequelize.col(`categories.id`))
          ),
          {
            [Sequelize.Op.contains]: [categoryId],
          }
      )
      : {};

    const result = await this._Article.findAndCountAll({
      subQuery: false,
      attributes,
      group: [Sequelize.col(`Article.id`)],
      include: [
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          distinct: true,
          required: mostCommented,
          attributes: [],
        },
        {
          model: this._Category,
          as: Alias.CATEGORIES,
          through: {
            attributes: [],
          },
          attributes: [],
        },
      ],
      order,
      limit,
      offset,
      having: havingCategoryId,
    });

    result.rows = result.rows.map((row) => row.get());
    result.count = result.count.length;

    if (withCategories) {
      result.rows.forEach((article) => {
        article.categories = [...article.categoryObjects];
        delete article.categoryObjects;
      });
    }

    return result;
  }

  async findHotOnes() {
    return (await this.findAndCountAll({
      mostCommented: true,
      limit: Limit.HOT_ARTICLES_SECTION,
    })).rows;
  }

  async findOne(articleId) {
    const article = await this._Article.findOne({
      attributes: [
        `id`,
        `title`,
        `fullText`,
        `announce`,
        `picture`,
        `createdAt`,
      ],
      include: [
        {
          model: this._Category,
          through: {attributes: []},
          as: Alias.CATEGORIES,
          attributes: [`id`, `name`],
        },
      ],
      where: {id: articleId},
    });

    return article.get();
  }

  async checkExistence(articleId) {
    return await this._Article.findByPk(articleId);
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
