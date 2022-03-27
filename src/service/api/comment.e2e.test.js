"use strict";

const Sequelize = require(`sequelize`);
const express = require(`express`);
const request = require(`supertest`);

const initDB = require(`../lib/init-db`);

const comment = require(`./comment`);
const CommentService = require(`../data-service/comment-service`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
  `Здоровье`,
  `Наука`,
  `Спорт`,
  `Кулинария`,
];

const mockUsers = [
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

const mockArticles = [
  {
    authorEmail: `ivanov@example.com`,
    title: `Учим HTML и CSS`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Санкции к иранцу обсуждаются руководством клуба. Борщ имеет сотни вариантов приготовления и каждый из них по-своему уникален. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    createdAt: `2022-03-10T06:01:26.259Z`,
    picture: `forest@1x.jpg`,
    comments: [
      {
        authorEmail: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то?`,
        createdAt: `2022-03-10T23:28:26.260Z`,
      },
      {
        authorEmail: `ivanov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        createdAt: `2022-03-12T15:28:26.260Z`,
      },
      {
        authorEmail: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        createdAt: `2022-03-12T05:20:26.260Z`,
      },
    ],
    categories: [`Музыка`, `Наука`],
  },
  {
    authorEmail: `ivanov@example.com`,
    title: `Окулист назвал два повседневных продукта, которые сильно портят зрение`,
    announce: `Ученые решили давнюю проблему неоднородности резины, получаемой из кремнийорганического каучука для использования в составе композитных материалов.`,
    fullText: `Ученые решили давнюю проблему неоднородности резины, получаемой из кремнийорганического каучука для использования в составе композитных материалов. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году.`,
    createdAt: `2022-01-04T02:22:26.260Z`,
    picture: `forest@1x.jpg`,
    comments: [
      {
        authorEmail: `ivanov@example.com`,
        text: `Согласен с автором! Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`,
        createdAt: `2022-02-16T15:57:26.260Z`,
      },
      {
        authorEmail: `sidorov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        createdAt: `2022-02-28T09:40:26.260Z`,
      },
      {
        authorEmail: `petrov@example.com`,
        text: `Хочу такую же футболку :-) Плюсую, но слишком много буквы!`,
        createdAt: `2022-02-10T01:35:26.260Z`,
      },
    ],
    categories: [`За жизнь`, `IT`, `Кулинария`],
  },
  {
    authorEmail: `ivanov@example.com`,
    title: `Как перестать беспокоиться и начать жить`,
    announce: `Ученые решили давнюю проблему неоднородности резины, получаемой из кремнийорганического каучука для использования в составе композитных материалов.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов.`,
    createdAt: `2022-02-22T02:36:26.260Z`,
    picture: `forest@1x.jpg`,
    comments: [
      {
        authorEmail: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        createdAt: `2022-02-25T06:47:26.260Z`,
      },
      {
        authorEmail: `ivanov@example.com`,
        text: `Согласен с автором!`,
        createdAt: `2022-03-03T02:00:26.260Z`,
      },
    ],
    categories: [`Деревья`, `IT`],
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });

  const app = express();
  app.use(express.json());

  comment(app, new CommentService(mockDB));

  return app;
};

let response;

describe(`API returns a list of all comments`, () => {
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Should return correct comments count`, () =>
    expect(response.body.length).toBe(8));
});

describe(`API returns limited list of comments`, () => {
  const limit = 2;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/comments?limit=${limit}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Should return correct comments count`, () =>
    expect(response.body.length).toBe(limit));
});

describe(`API should delete existent comment`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/comments/1`);
  });

  test(`Status code 204`, () =>
    expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

  test(`Should return decreased comments count`, () =>
    request(app)
      .get(`/comments`)
      .expect(({body}) => expect(body.length).toBe(7)));
});

describe(`API  refuses to delete comment by invalid id`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/comments/INVALID`);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Comments count should not be changed`, () =>
    request(app)
      .get(`/comments`)
      .expect(({body}) => expect(body.length).toBe(8)));
});

describe(`API  refuses to delete non-existent comment`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/comments/300`);
  });

  test(`Status code 404`, () =>
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND));

  test(`Comments count should not be changed`, () =>
    request(app)
      .get(`/comments`)
      .expect(({body}) => expect(body.length).toBe(8)));
});
