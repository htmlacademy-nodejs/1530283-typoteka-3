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
  } catch (err) {
    console.error(chalk.red(err));
    return fallbackContent;
  }
};

const multiLineJoin = (items) => items.join(`,\n`);

module.exports = {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
  readFile,
  multiLineJoin
};
