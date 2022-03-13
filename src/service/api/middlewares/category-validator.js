'use strict';

const {HttpCode} = require(`../../../constants`);

const requiredCategoryKeys = [`name`];

const categoryValidator = (req, res, next) => {
  const newCategory = req.body;
  const absentKeys = [];
  const articleKeys = Object.keys(newCategory);

  for (const requiredKey of requiredCategoryKeys) {
    const keyExists = articleKeys.includes(requiredKey);
    if (!keyExists) {
      absentKeys.push(requiredKey);
    }
  }

  if (absentKeys.length) {
    const formattedAbsentKeys = absentKeys.join(`, `);
    res.status(HttpCode.BAD_REQUEST)
      .send(`Category does not have required fields: ${formattedAbsentKeys}`);
    return;
  }

  next();
};

module.exports = categoryValidator;
