"use strict";

const {Model} = require(`sequelize`);

const defineUser = require(`./user`);
const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const User = defineUser(sequelize);
  const Category = defineCategory(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);

  User.hasMany(Article, {
    as: `articles`,
    foreignKey: {
      name: `authorId`,
      allowNull: false,
    },
    onUpdate: `cascade`,
    onDelete: `cascade`,
  });

  Article.belongsTo(User, {
    as: `author`,
    foreignKey: `authorId`,
  });

  Article.hasMany(Comment, {
    as: `comments`,
    foreignKey: {
      name: `articleId`,
      allowNull: false,
    },
    onUpdate: `cascade`,
    onDelete: `cascade`,
  });

  Comment.belongsTo(Article, {
    as: `article`,
    foreignKey: `articleId`,
  });

  User.hasMany(Comment, {
    as: `comments`,
    foreignKey: {
      name: `authorId`,
      allowNull: false,
    },
    onUpdate: `cascade`,
    onDelete: `cascade`,
  });

  Comment.belongsTo(User, {
    as: `author`,
    foreignKey: `authorId`,
  });

  ArticleCategory.init(
      {},
      {
        sequelize,
        modelName: `ArticleCategory`,
        tableName: `articles_categories`,
        underscored: true,
      }
  );

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: `categories`,
    foreignKey: {
      name: `articleId`,
      allowNull: false,
    },
    onDelete: `cascade`,
    onUpdate: `cascade`,
  });

  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: `articles`,
    foreignKey: {
      name: `categoryId`,
      allowNull: false,
    },
    onDelete: `restrict`,
    onUpdate: `cascade`,
  });

  return {User, Article, Comment, Category, ArticleCategory};
};

module.exports = define;
