"use strict";

const {DataTypes, Model} = require(`sequelize`);

class User extends Model {}

const define = (sequelize) =>
  User.init(
      {
        email: {
        // eslint-disable-next-line new-cap
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        firstName: {
          // eslint-disable-next-line new-cap
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        lastName: {
          // eslint-disable-next-line new-cap
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        passwordHash: {
          // eslint-disable-next-line new-cap
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        avatar: {
          // eslint-disable-next-line new-cap
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
