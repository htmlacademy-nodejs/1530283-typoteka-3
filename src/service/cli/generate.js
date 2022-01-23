"use strict";

const chalk = require(`chalk`);

const fs = require(`fs`);
const dayjs = require(`dayjs`);
const {ExitCode} = require(`../../constants`);
const {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;

const MAX_COUNT = 1000;

const FILE_MOCKS_PATH = `mocks.json`;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const SentenceRestrict = {
  MIN: 1,
  MAX: 5,
};

const DayRestrict = {
  MIN: 1,
  MAX: 90,
};

const generateAnnounce = () =>
  shuffle(SENTENCES)
    .slice(0, getRandomInt(SentenceRestrict.MIN, SentenceRestrict.MAX))
    .join(` `);

const generateFullText = () =>
  shuffle(SENTENCES)
    .slice(0, getRandomInt(SentenceRestrict.MAX, SENTENCES.length - 1))
    .join(` `);

const generateCreatedDate = () => {
  const randomDay = getRandomInt(DayRestrict.MIN, DayRestrict.MAX);
  return dayjs().subtract(randomDay, `day`).toISOString();
};

const generateArticle = () => ({
  title: getRandomItem(TITLES),
  announce: generateAnnounce(),
  fullText: generateFullText(),
  createdDate: generateCreatedDate(),
  category: getUniqueArray(CATEGORIES),
});

const generateArticles = (count) => Array(count).fill({}).map(generateArticle);

module.exports = {
  name: `--generate`,
  run(args) {
    const [rawCount] = args;
    const count = Number.parseInt(rawCount, 10) || DEFAULT_COUNT;

    if (count > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateArticles(count));

    console.info(chalk.yellowBright(`Дождитесь окончания записи файла...`));

    fs.writeFile(FILE_MOCKS_PATH, content, (err) => {
      if (err) {
        return console.error(chalk.red(`Операция завершена с ошибкой. Данные не сохранены.`));
      }

      return console.info(chalk.green(`Операция завершена успешно. Данные записаны в файл ${FILE_MOCKS_PATH}.`));
    });
  },
};
