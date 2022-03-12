"use strict";

const fs = require(`fs`).promises;

const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);

const {ExitCode, FilePath, FileType} = require(`../../constants`);
const {
  readFile,
  getRandomItem,
  shuffle,
  getRandomInt,
  getUniqueArray,
} = require(`../../utils/common`);
const {formatTimestamp, getRandomPastDate} = require(`../../utils/date`);

const DEFAULT_COUNT = 3;

const SentenceRestrict = {
  MIN: 2,
  MAX: 4,
};

const CommentsCountRestrict = {
  MIN: 0,
  MAX: 3,
};

const CommentTextRestrict = {
  MIN: 1,
  MAX: 3,
};

const DayRestrict = {
  MIN: 1,
  MAX: 90,
};

const USERS = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
    isAdmin: true,
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`,
  },
  {
    email: `sidorov@example.com`,
    passwordHash: `5f4fcc3b5aa56fd61j832ud6be82cf99`,
    firstName: `Сидор`,
    lastName: `Сидоров`,
    avatar: `avatar-3.png`,
  },
];

const generateAnnounce = (sentences) => getRandomItem(sentences);

const generateFullText = (sentences) =>
  shuffle(sentences)
    .slice(0, getRandomInt(SentenceRestrict.MIN, SentenceRestrict.MAX))
    .join(` `);

const generateCreatedDate = (randomDay) => {
  return formatTimestamp(getRandomPastDate(randomDay));
};

const generateComment = ({commentTexts, articleDaysBefore}) => {
  const daysBefore = getRandomInt(DayRestrict.MIN - 1, articleDaysBefore - 1);
  return {
    authorEmail: getRandomItem(USERS).email,
    text: shuffle(commentTexts)
      .slice(0, getRandomInt(CommentTextRestrict.MIN, CommentTextRestrict.MAX))
      .join(` `),
    createdAt: generateCreatedDate(daysBefore),
  };
};

const generateComments = (count, sourceData) =>
  Array(count)
    .fill({})
    .map(() => generateComment(sourceData));

const generateArticle = ({
  titles,
  sentences,
  pictures,
  commentTexts,
  categories,
}) => {
  const daysBefore = getRandomInt(DayRestrict.MIN, DayRestrict.MAX);

  const commentsCount = getRandomInt(
      CommentsCountRestrict.MIN,
      CommentsCountRestrict.MAX
  );

  return {
    authorEmail: USERS[0].email,
    title: getRandomItem(titles),
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    createdAt: generateCreatedDate(daysBefore),
    picture: getRandomItem(pictures),
    comments: generateComments(commentsCount, {
      commentTexts,
      articleDaysBefore: daysBefore,
    }),
    categories: getUniqueArray(categories),
  };
};

const generateArticles = (count, sourceData) =>
  Array(count)
    .fill({})
    .map(() => generateArticle(sourceData));

module.exports = {
  name: `--fill-db`,
  run: async (args) => {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      console.info(`Connection to database established`);
    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    const [titles, categories, sentences, commentTexts, pictures] =
      await Promise.all([
        readFile(FilePath.TITLES, FileType.TEXT),
        readFile(FilePath.CATEGORIES, FileType.TEXT),
        readFile(FilePath.SENTENCES, FileType.TEXT),
        readFile(FilePath.COMMENTS, FileType.TEXT),
        readFile(FilePath.PICTURES, FileType.TEXT),
      ]);

    const [rawCount] = args;
    const count = Number.parseInt(rawCount, 10) || DEFAULT_COUNT;

    const articles = generateArticles(count, {
      titles,
      sentences,
      pictures,
      commentTexts,
      categories
    });

    await fs.writeFile(FilePath.MOCKS, JSON.stringify(articles, null, 2));

    try {
      console.info(`Database initializing...`);
      await initDb(sequelize, {users: USERS, categories, articles});
      console.info(`Database is initialized successfully`);
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(`Database initialization failed: ${error}`);
      process.exit(ExitCode.ERROR);
    }
  },
};
