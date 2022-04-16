"use strict";

const {ExitCode, FilePath, FileType} = require(`../../constants`);

const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);
const passwordService = require(`../lib/password-service`);
const {getLogger} = require(`../lib/logger/logger`);

const {
  readFile,
  getRandomItem,
  shuffle,
  getRandomInt,
  getUniqueArray,
} = require(`../../utils/common`);
const {formatTimestamp, getRandomPastDate} = require(`../../utils/date`);

const {MOCK_PASSWORD} = process.env;

if (!MOCK_PASSWORD) {
  throw new Error(`MOCK_PASSWORD environment variable is not defined`);
}

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
    email: `admin@example.com`,
    passwordHash: passwordService.hashSync(MOCK_PASSWORD),
    firstName: `Админ`,
    lastName: `Админов`,
    avatar: `avatar-1.png`,
    isAdmin: true,
  },
  {
    email: `ivanov@example.com`,
    passwordHash: passwordService.hashSync(MOCK_PASSWORD),
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-2.png`,
  },
  {
    email: `petrov@example.com`,
    passwordHash: passwordService.hashSync(MOCK_PASSWORD),
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-3.png`,
  },
  {
    email: `sidorov@example.com`,
    passwordHash: passwordService.hashSync(MOCK_PASSWORD),
    firstName: `Сидор`,
    lastName: `Сидоров`,
    avatar: `avatar-4.png`,
  },
];

const logger = getLogger({name: `fill-db`});

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
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established successfully`);
    } catch (err) {
      logger.error(
          `An error occurred during database connection: ${err.message}`
      );
      process.exit(ExitCode.ERROR);
    }

    let data;

    try {
      logger.info(`Start data reading...`);
      data = await Promise.all([
        readFile(FilePath.TITLES, FileType.TEXT),
        readFile(FilePath.CATEGORIES, FileType.TEXT),
        readFile(FilePath.SENTENCES, FileType.TEXT),
        readFile(FilePath.COMMENTS, FileType.TEXT),
        readFile(FilePath.PICTURES, FileType.TEXT),
      ]);
      logger.info(`Data is read successfully`);
    } catch (error) {
      logger.error(`An error occurred during files reading: ${error.message}`);
      process.exit(ExitCode.ERROR);
    }

    const [titles, categories, sentences, commentTexts, pictures] = data;

    const [rawCount] = args;
    const count = Number.parseInt(rawCount, 10) || DEFAULT_COUNT;

    const articles = generateArticles(count, {
      titles,
      sentences,
      pictures,
      commentTexts,
      categories,
    });

    try {
      logger.info(`Database initializing...`);
      await initDb(sequelize, {users: USERS, categories, articles});
      logger.info(`Database is initialized successfully`);
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      logger.error(`An error occurred during database initializing: ${error}`);
      process.exit(ExitCode.ERROR);
    }
  },
};
