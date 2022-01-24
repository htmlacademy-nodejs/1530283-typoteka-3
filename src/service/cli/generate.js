"use strict";

const chalk = require(`chalk`);

const fs = require(`fs`).promises;
const dayjs = require(`dayjs`);
const {ExitCode, FilePath} = require(`../../constants`);
const {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
  readContent,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;

const MAX_COUNT = 1000;

const SentenceRestrict = {
  MIN: 1,
  MAX: 5,
};

const DayRestrict = {
  MIN: 1,
  MAX: 90,
};

const generateAnnounce = (sentences) =>
  shuffle(sentences)
    .slice(0, getRandomInt(SentenceRestrict.MIN, SentenceRestrict.MAX))
    .join(` `);

const generateFullText = (sentences) =>
  shuffle(sentences)
    .slice(0, getRandomInt(SentenceRestrict.MAX, sentences.length - 1))
    .join(` `);

const generateCreatedDate = () => {
  const randomDay = getRandomInt(DayRestrict.MIN, DayRestrict.MAX);
  return dayjs().subtract(randomDay, `day`).toISOString();
};

const generateArticle = ({titles, categories, sentences}) => ({
  title: getRandomItem(titles),
  announce: generateAnnounce(sentences),
  fullText: generateFullText(sentences),
  createdDate: generateCreatedDate(),
  category: getUniqueArray(categories),
});

const generateArticles = (count, sourceData) =>
  Array(count)
    .fill({})
    .map(() => generateArticle(sourceData));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [rawCount] = args;
    const count = Number.parseInt(rawCount, 10) || DEFAULT_COUNT;

    if (count > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const [titles, categories, sentences] = await Promise.all([
      readContent(FilePath.TITLES),
      readContent(FilePath.CATEGORIES),
      readContent(FilePath.SENTENCES),
    ]);

    const content = JSON.stringify(
        generateArticles(count, {titles, categories, sentences})
    );

    console.info(chalk.yellowBright(`Дождитесь окончания записи файла...`));

    try {
      await fs.writeFile(FilePath.MOCKS, content);
      console.info(
          chalk.green(
              `Операция завершена успешно. Данные записаны в файл ${FilePath.MOCKS}.`
          )
      );
    } catch (error) {
      console.error(
          chalk.red(`Операция завершена с ошибкой. Данные не сохранены.`)
      );
      process.exit(ExitCode.ERROR);
    }
  },
};
