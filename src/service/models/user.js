"use strict";

const {DataTypes, Model} = require(`sequelize`);

class User extends Model {
}

const define = (sequelize) =>
  User.init(
      {
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        firstName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        avatar: {
          type: DataTypes.STRING(50),
          allowNull: true
        },
      },
      {
        sequelize,
        modelName: `User`,
        tableName: `users`,
        underscored: true,
      }
  );

module.exports = define;
