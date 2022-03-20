'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  picture: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(50),
    allowNull: true,
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
  underscored: true,
});

module.exports = define;
