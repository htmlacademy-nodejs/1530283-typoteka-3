"use strict";

const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {ExitCode, FilePath, FileType} = require(`../../constants`);
const {
  shuffle,
  readFile,
  getRandomInt,
  getRandomItem,
  multiLineJoin,
} = require(`../../utils/common`);
const {formatTimestamp, getRandomPastDate} = require(`../../utils/date`);

const DEFAULT_COUNT = 3;

const MAX_COUNT = 1000;

const CategoryCountRestrict = {
  MIN: 1,
  MAX: 5,
};

const CommentsCountRestrict = {
  MIN: 5,
  MAX: 7,
};

const CommentTextRestrict = {
  MIN: 1,
  MAX: 3,
};

const SentenceRestrict = {
  MIN: 2,
  MAX: 4,
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

const AUTHOR_ID = 1;

const generateAnnounce = (sentences) => getRandomItem(sentences);

const generateFullText = (sentences) =>
  shuffle(sentences)
    .slice(0, getRandomInt(SentenceRestrict.MIN, SentenceRestrict.MAX))
    .join(` `);

const generateCreatedDate = (randomDay) => {
  return formatTimestamp(getRandomPastDate(randomDay));
};

const generateComment = (comments, articleId, articleDaysBefore) => {
  const daysBefore = getRandomInt(DayRestrict.MIN - 1, articleDaysBefore - 1);
  return {
    userId: getRandomInt(1, USERS.length),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(CommentTextRestrict.MIN, CommentTextRestrict.MAX))
      .join(` `),
    createdDate: generateCreatedDate(daysBefore),
  };
};

const generateArticle = ({titles, sentences, pictures}) => {
  const daysBefore = getRandomInt(DayRestrict.MIN, DayRestrict.MAX);
  return {
    title: getRandomItem(titles),
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    createdDate: generateCreatedDate(daysBefore),
    picture: getRandomItem(pictures),
    daysBefore,
  };
};

const generateArticles = (count, sourceData) =>
  Array(count)
    .fill({})
    .map(() => generateArticle(sourceData));

module.exports = {
  name: `--fill`,
  async run(args) {
    const [rawCount] = args;
    const count = Number.parseInt(rawCount, 10) || DEFAULT_COUNT;

    if (count > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const [titles, categories, sentences, commentTexts, pictures] = await Promise.all([
      readFile(FilePath.TITLES, FileType.TEXT),
      readFile(FilePath.CATEGORIES, FileType.TEXT),
      readFile(FilePath.SENTENCES, FileType.TEXT),
      readFile(FilePath.COMMENTS, FileType.TEXT),
      readFile(FilePath.PICTURES, FileType.TEXT),
    ]);

    const articles = generateArticles(count, {titles, sentences, pictures});

    const comments = [];

    articles.forEach((_article, articleIndex) => {
      const commentsCount = getRandomInt(
          CommentsCountRestrict.MIN,
          CommentsCountRestrict.MAX
      );
      const articleComments = new Array(commentsCount).fill(null).map(() => {
        return generateComment(
            commentTexts,
            articleIndex + 1,
            articles[articleIndex].daysBefore
        );
      });

      articleComments.forEach((comment) => comments.push(comment));
    });

    const categoriesValues = multiLineJoin(
        categories.map((name) => `('${name}')`)
    );

    const usersValues = multiLineJoin(
        USERS.map(
            ({email, passwordHash, firstName, lastName, avatar, isAdmin}) =>
              `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}', ${
                isAdmin || false
              })`
        )
    );

    const articlesValues = multiLineJoin(
        articles.map(
            ({createdDate, title, announce, fullText, picture}) =>
              `('${createdDate}', '${title}', '${announce}', '${fullText}', ${AUTHOR_ID}, '${picture}')`
        )
    );

    const commentsValues = multiLineJoin(
        comments.map(
            ({text, articleId, userId, createdDate}) => `('${text}', ${articleId}, ${userId}, '${createdDate}')`
        )
    );

    const articlesCategories = [];

    articles.forEach((_article, articleIndex) => {
      const randomCategorySequence = shuffle(
          new Array(categories.length)
          .fill(null)
          .map((_item, categoryIndex) => categoryIndex + 1)
      );

      const categoryCount = getRandomInt(
          CategoryCountRestrict.MIN,
          CategoryCountRestrict.MAX
      );

      const articleCategories = randomCategorySequence
        .slice(0, categoryCount)
        .map((categoryId) => ({
          articleId: articleIndex + 1,
          categoryId,
        }));

      articleCategories.forEach((articleCategory) =>
        articlesCategories.push(articleCategory)
      );
    });

    const articlesCategoriesValues = multiLineJoin(
        articlesCategories.map(
            ({articleId, categoryId}) => `(${articleId}, ${categoryId})`
        )
    );

    const content = `-- Заполняет значениями таблицу категорий
INSERT INTO categories(name) VALUES
${categoriesValues};

-- Заполняет значениями таблицу пользователей
INSERT INTO users(email, password_hash, first_name, last_name, avatar, is_admin) VALUES
${usersValues};

-- Заполняет значениями таблицу публикаций
INSERT INTO articles(created_at, title, announce, full_text, author_id, picture) VALUES
${articlesValues};

-- Заполняет значениями таблицу сочетаний публикация-категория
INSERT INTO articles_categories(article_id, category_id) VALUES
${articlesCategoriesValues};

-- Заполняет значениями таблицу комментариев
INSERT INTO comments(text, article_id, user_id, created_at) VALUES
${commentsValues};
`;

    console.info(chalk.yellowBright(`Дождитесь окончания записи файла...`));

    try {
      await fs.writeFile(FilePath.FILL_DB, content);
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
