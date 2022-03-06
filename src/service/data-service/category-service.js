"use strict";

const Sequelize = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Article = sequelize.models.Article;
  }

  async findAll({withArticlesCount = false, havingArticles = false} = {}) {
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
      ]
    });

    return categories.map((category) => category.get());
  }
}

module.exports = CategoryService;
