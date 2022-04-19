"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {FileType} = require(`../constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = (items) => items[getRandomInt(0, items.length - 1)];

const shuffle = (items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [items[i], items[randomPosition]] = [items[randomPosition], items[i]];
  }

  return items;
};

const getUniqueArray = (items) => {
  return shuffle(items).slice(0, getRandomInt(1, items.length - 1));
};

const readFile = async (filePath, fileType, fallbackContent = []) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    switch (fileType) {
      case FileType.JSON:
        return JSON.parse(content);

      case FileType.TEXT:
        return content.trim().split(`\n`);

      default:
        throw new Error(`Unknown file type: ${fileType}`);
    }
  } catch (error) {
    console.error(chalk.red(error));
    return fallbackContent;
  }
};

const prepareErrors = (error) =>
  error.details.reduce(
      (errors, {message, context}) => ({
        ...errors,
        [context.key]: message,
      }),
      {}
  );

const multiLineJoin = (items) => items.join(`,\n`);

const ensureArray = (value) => (Array.isArray(value) ? value : [value]);

const truncateText = (text, maxLength) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

module.exports = {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
  readFile,
  prepareErrors,
  multiLineJoin,
  ensureArray,
  truncateText
};
