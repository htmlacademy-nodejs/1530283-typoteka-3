"use strict";

const Sequelize = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Article = sequelize.models.Article;
  }

  async findAll({withArticlesCount, havingArticles, articleId}) {
    const basicAttributes = [`id`, `name`];

    const attributes = withArticlesCount
      ? [...basicAttributes, [Sequelize.fn(`COUNT`, Sequelize.col(`articles.id`)),
        `articlesCount`]]
      : basicAttributes;

    const categories = await this._Category.findAll({
      attributes,
      group: [Sequelize.col(`Category.id`)],
      include: [
        {
          model: this._Article,
          as: `articles`,
          required: Boolean(havingArticles),
          attributes: [],
          through: {attributes: []},
        },
      ],
      order: [[`id`, `DESC`]],
      having: articleId ?
        Sequelize.where(Sequelize.fn(`ARRAY_AGG`, Sequelize.col(`articles.id`)), {
          [Sequelize.Op.contains]: [Number(articleId)]
        })
        : {}
    });

    return categories.map((category) => category.get());
  }

  async checkExistence(categoryId) {
    await this._Category.findByPk(categoryId);
  }

  async create(newCategoryData) {
    return await this._Category.create(newCategoryData);
  }

  async update(categoryId, updatedCategoryData) {
    const updatedCategory = await this._Category.update(updatedCategoryData, {
      where: {
        id: categoryId
      }
    });

    return updatedCategory;
  }

  async drop(categoryId) {
    return await this._Category.destroy({
      where: {
        id: categoryId
      }
    });
  }
}

module.exports = CategoryService;
