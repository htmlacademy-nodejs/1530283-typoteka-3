"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article-service`);
const CommentService = require(`../data-service/comment-service`);
const {HttpCode} = require(`../../constants`);
const {clone} = require(`../../utils/common`);

const mockData = [
  {
    id: `P2ytE4`,
    title: `Как собрать камни бесконечности`,
    announce: `Запекайте в духовке 30 минут или пока помидоры черри не станут мягкими и не лопнут.`,
    fullText: `Продукты, богатые антиоксидантами, противовоспалительными компонентами, функциональные продукты также положительно влияют на лёгкие. Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. По мнению окулиста, худшие для здоровья глаз продукты – хлеб и макароны. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Образец весом 60 килограммов уже прошел испытания на полигоне, и сейчас идет создание более крупномасштабного аппарата. Ученые решили давнюю проблему неоднородности резины, получаемой из кремнийорганического каучука для использования в составе композитных материалов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Санкции к иранцу обсуждаются руководством клуба.`,
    createdDate: `2022-01-21T06:46:02.569Z`,
    categories: [`Программирование`],
    comments: [
      {
        id: `SDIcs0`,
        text: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
      },
      {id: `HkvW-X`, text: `Это где ж такие красоты? Согласен с автором!`},
      {
        id: `GFOG8r`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {id: `AuKycb`, text: `Хочу такую же футболку :-) Согласен с автором!`},
    ],
  },
  {
    id: `bOYRF-`,
    title: `Самый лучший музыкальный альбом этого года`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Продукты, богатые антиоксидантами, противовоспалительными компонентами, функциональные продукты также положительно влияют на лёгкие. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Санкции к иранцу обсуждаются руководством клуба. Простые ежедневные упражнения помогут достичь успеха. Ученые решили давнюю проблему неоднородности резины, получаемой из кремнийорганического каучука для использования в составе композитных материалов. Запекайте в духовке 30 минут или пока помидоры черри не станут мягкими и не лопнут. Образец весом 60 килограммов уже прошел испытания на полигоне, и сейчас идет создание более крупномасштабного аппарата.`,
    createdDate: `2022-01-21T06:46:02.570Z`,
    categories: [],
    comments: [],
  },
  {
    id: `9F-Pjp`,
    title: `Окулист назвал два повседневных продукта, которые сильно портят зрение`,
    announce: `По мнению окулиста, худшие для здоровья глаз продукты – хлеб и макароны. Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов.`,
    fullText: `Достичь успеха помогут ежедневные повторения. По мнению окулиста, худшие для здоровья глаз продукты – хлеб и макароны. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Борщ имеет сотни вариантов приготовления и каждый из них по-своему уникален. Ученые решили давнюю проблему неоднородности резины, получаемой из кремнийорганического каучука для использования в составе композитных материалов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Запекайте в духовке 30 минут или пока помидоры черри не станут мягкими и не лопнут. Образец весом 60 килограммов уже прошел испытания на полигоне, и сейчас идет создание более крупномасштабного аппарата. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Санкции к иранцу обсуждаются руководством клуба. Программировать не настолько сложно, как об этом говорят. Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    createdDate: `2021-12-11T06:46:02.570Z`,
    categories: [`Кулинария`, `За жизнь`],
    comments: [
      {
        id: `rcIqxh`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы!`,
      },
      {
        id: `cP7c7G`,
        text: `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Совсем немного...`,
      },
      {id: `JfG4mQ`, text: `Хочу такую же футболку :-) Согласен с автором!`},
    ],
  },
];

let response;

const createAPI = () => {
  const app = express();
  const clonedMockData = clone(mockData);
  app.use(express.json());
  article(app, new ArticleService(clonedMockData), new CommentService(clonedMockData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 articles`, () =>
    expect(response.body.length).toBe(mockData.length));

  test(`First article's id equals "P2ytE4"`, () =>
    expect(response.body[0].id).toBe(`P2ytE4`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).get(`/articles/bOYRF-`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Самый лучший музыкальный альбом этого года"`, () =>
    expect(response.body.title).toBe(
        `Самый лучший музыкальный альбом этого года`
    ));
});

describe(`API returns status code 404 when trying to get non-existent article`, () => {
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).get(`/articles/NON_EXIST`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});


describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Обзор новейшего смартфона`,
    announce:
      `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
    fullText:
      `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdDate: `2022-01-09T08:08:28.115Z`,
    categories: [
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `Деревья`,
      `Программирование`,
      `Спорт`,
      `Железо`,
      `Наука`,
    ],
  };
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is increased`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.length).toBe(mockData.length + 1)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Обзор новейшего смартфона`,
    announce:
      `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
    fullText:
      `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdDate: `2022-01-09T08:08:28.115Z`,
    categories: [
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `Деревья`,
      `Программирование`,
      `Спорт`,
      `Железо`,
      `Наука`,
    ],
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Articles count is not changed`, () =>
    request(app)
    .get(`/articles`)
    .expect(({body}) => expect(body.length).toBe(mockData.length)));
});

describe(`API changes existent article with given id`, () => {
  const newArticle = {
    title: `Обновленный заголовок`,
    announce:
      `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
    fullText:
      `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdDate: `2022-01-09T08:08:28.115Z`,
    categories: [
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `Деревья`,
      `Программирование`,
      `Спорт`,
      `Железо`,
      `Наука`,
    ],
  };
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).put(`/articles/9F-Pjp`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/9F-Pjp`)
      .expect(({body}) => expect(body.title).toBe(`Обновленный заголовок`)));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.length).toBe(mockData.length)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `Обновленный заголовок`,
    announce:
      `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
    fullText:
      `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdDate: `2022-01-09T08:08:28.115Z`,
    categories: [
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `Деревья`,
      `Программирование`,
      `Спорт`,
      `Железо`,
      `Наука`,
    ],
  };

  return request(app)
    .put(`/articles/NON_EXIST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    title: `Обновленный заголовок`,
  };

  return request(app)
    .put(`/articles/P2ytE4`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article with given id`, () => {
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).delete(`/articles/P2ytE4`);
  });

  test(`Status code 204`, () => expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

  test(`Returns no body`, () => expect(response.body).toEqual({}));

  test(`Articles count is decreased`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.length).toBe(mockData.length - 1)));
});

describe(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).delete(`/articles/NON_EXIST`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.length).toBe(mockData.length)));
});
