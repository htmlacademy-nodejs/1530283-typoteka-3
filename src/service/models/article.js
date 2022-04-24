'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {
}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  announce: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fullText: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  picture: {
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
