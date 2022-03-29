"use strict";

const Sequelize = require(`sequelize`);

const {Op} = Sequelize;

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      attributes: [`id`, `title`, `createdAt`],
      order: [[`createdAt`, `DESC`]],
      where: {
        title: {
          [Op.substring]: searchText,
        },
      },
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
