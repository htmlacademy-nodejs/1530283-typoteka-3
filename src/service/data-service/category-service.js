"use strict";

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
  }

  async findAll() {
    const categories = this._Category.findAll({
      attributes: [`id`, `name`],
      raw: true,
    });

    return categories;
  }
}

module.exports = CategoryService;
