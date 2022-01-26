"use strict";

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {HttpCode} = require(`./constants`);

const PATH_DIVIDER = `/`;
const NOT_FOUND = `Not Found`;

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
  return shuffle(items).slice(0, getRandomInt(0, items.length - 1));
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const sendPath = (req, res) => {
  const path = `${req.baseUrl}${req.route.path}`;

  if (path !== PATH_DIVIDER && path.slice(-1) === PATH_DIVIDER) {
    res.send(path.slice(0, -1));
    return;
  }

  res.send(path);
};

const sendNotFound = (req, res) => {
  res.status(HttpCode.NOT_FOUND);
  res.send(NOT_FOUND);
};

module.exports = {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
  readContent,
  sendPath,
  sendNotFound,
};
