"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Category extends Model {}

const define = (sequelize) =>
  Category.init(
      {
        name: {
          // eslint-disable-next-line new-cap
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true
        },
      },
      {
        sequelize,
        modelName: `Category`,
        tableName: `categories`,
        underscored: true,
      }
  );

module.exports = define;
