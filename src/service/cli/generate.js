"use strict";

const chalk = require(`chalk`);

const fs = require(`fs`).promises;
const dayjs = require(`dayjs`);
const {ExitCode, FilePath, FileType} = require(`../../constants`);
const {
  shuffle,
  getRandomInt,
  getRandomItem,
  getUniqueArray,
  readFile,
  getId,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;

const MAX_COUNT = 1000;

const CommentsCountRestrict = {
  MIN: 0,
  MAX: 5,
};

const CommentTextRestrict = {
  MIN: 1,
  MAX: 3,
};

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

const generateComment = (comments) => ({
  id: getId(),
  text: shuffle(comments)
  .slice(0, getRandomInt(CommentTextRestrict.MIN, CommentTextRestrict.MAX))
  .join(` `),
});

const generateArticle = ({titles, categories, sentences, comments}) => {
  return {
    id: getId(),
    title: getRandomItem(titles),
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    createdDate: generateCreatedDate(),
    category: getUniqueArray(categories),
    comments: Array(getRandomInt(CommentsCountRestrict.MIN, CommentsCountRestrict.MAX))
      .fill({})
      .map(() => generateComment(comments)),
  };
};

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

    const [titles, categories, sentences, comments] = await Promise.all([
      readFile(FilePath.TITLES, FileType.TEXT),
      readFile(FilePath.CATEGORIES, FileType.TEXT),
      readFile(FilePath.SENTENCES, FileType.TEXT),
      readFile(FilePath.COMMENTS, FileType.TEXT),
    ]);

    const content = JSON.stringify(
        generateArticles(count, {titles, categories, sentences, comments})
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
