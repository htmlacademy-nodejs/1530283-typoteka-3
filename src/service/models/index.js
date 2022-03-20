"use strict";

const {Model} = require(`sequelize`);

const Alias = require(`./alias`);

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
    as: Alias.ARTICLES,
    foreignKey: {
      name: `authorId`,
      allowNull: false,
    },
    onUpdate: `cascade`,
    onDelete: `cascade`,
  });

  Article.belongsTo(User, {
    as: Alias.AUTHOR,
    foreignKey: `authorId`,
  });

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: {
      name: `articleId`,
      allowNull: false,
    },
    onUpdate: `cascade`,
    onDelete: `cascade`,
  });

  Comment.belongsTo(Article, {
    as: Alias.ARTICLE,
    foreignKey: `articleId`,
  });

  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: {
      name: `authorId`,
      allowNull: false,
    },
    onUpdate: `cascade`,
    onDelete: `cascade`,
  });

  Comment.belongsTo(User, {
    as: Alias.AUTHOR,
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
    as: Alias.CATEGORIES,
    foreignKey: {
      name: `articleId`,
      allowNull: false,
    },
    onDelete: `cascade`,
    onUpdate: `cascade`,
  });

  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES,
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
