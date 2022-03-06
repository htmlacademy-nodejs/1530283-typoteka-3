'use strict';

const defineModels = require(`../models`);

module.exports = async (sequelize) => {
  defineModels(sequelize);

  await sequelize.sync({force: true});
};
