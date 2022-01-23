'use strict';

const getRandomTrue = (probabilityOfTrue) => Math.random() < probabilityOfTrue;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = (items) => items[getRandomInt(0, items.length - 1)];

const getUniqueArray = (items) => {
  const nonUniqueItems = [];
  const maxCount = getRandomTrue(0.75) ? items.length / 2 : 1;

  for (let i = 0; i < maxCount; i++) {
    nonUniqueItems.push(getRandomItem(items));
  }

  return Array.from(new Set(nonUniqueItems));
};

const shuffle = (items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [items[i], items[randomPosition]] = [items[randomPosition], items[i]];
  }

  return items;
};

module.exports = {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
};
