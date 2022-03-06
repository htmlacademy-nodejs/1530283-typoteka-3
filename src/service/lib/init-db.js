"use strict";

const defineModels = require(`../models`);

module.exports = async (sequelize, {categories, users, articles}) => {
  const {Category, User, Article} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((category) => ({name: category}))
  );


  const userModels = await User.bulkCreate(users);

  const mapCategoryNameToId = categoryModels.reduce(
      (map, categoryModel) => ({
        ...map,
        [categoryModel.name]: categoryModel.id,
      }),
      {}
  );

  const mapUserEmailToId = userModels.reduce(
      (map, userModel) => ({
        ...map,
        [userModel.email]: userModel.id,
      }),
      {}
  );

  articles.forEach((article) => {
    article.authorId = mapUserEmailToId[article.authorEmail];

    article.comments.forEach((comment) => {
      comment.authorId = mapUserEmailToId[comment.authorEmail];
    });
  });

  try {
    const articlePromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {
        include: [`comments`],
      });

      await articleModel.addCategories(
          article.categories.map((category) => mapCategoryNameToId[category])
      );
    });

    await Promise.all(articlePromises);
  } catch (error) {
    console.error(error.message);
  }
};
