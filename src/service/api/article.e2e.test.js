"use strict";

const Sequelize = require(`sequelize`);
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);

const initDB = require(`../lib/init-db`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article-service`);
const CommentService = require(`../data-service/comment-service`);
const CategoryService = require(`../data-service/category-service`);

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

let response;

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });

  const app = express();
  app.use(express.json());

  article(
      app,
      new ArticleService(mockDB),
      new CommentService(mockDB),
      new CategoryService(mockDB)
  );

  return app;
};

describe(`API returns a list of all articles`, () => {
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of correct length`, () =>
    expect(response.body.rows.length).toBe(3));

  test(`Returns correct total count`, () =>
    expect(response.body.count).toBe(3));
});

describe(`API returns an article with given id`, () => {
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Самый лучший музыкальный альбом этого года"`, () =>
    expect(response.body.title).toBe(`Учим HTML и CSS`));
});

describe(`API returns status code 404 when trying to get article by invalid id`, () => {
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/INVALID`);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API returns status code 404 when trying to get non-existent article`, () => {
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/300`);
  });

  test(`Status code 404`, () =>
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

const validArticle = {
  title: `Обзор новейшего смартфона. Не стоит идти в программисты, если вам нравятся только игры.`,
  announce: `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
  fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  createdAt: `2022-01-09T08:08:28.115Z`,
  categories: [1, 2, 5, 7],
  authorId: 1,
  picture: `picture.png`,
};

describe(`API creates an article if data is valid`, () => {
  const newArticle = {...validArticle};

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => {
    const createdArticle = {
      ...newArticle,
      categories: newArticle.categories.map((id) => ({
        id,
        name: mockCategories[id - 1],
      })),
    };

    delete createdArticle.authorId;

    return expect(response.body).toEqual(
        expect.objectContaining(createdArticle)
    );
  });

  test(`Articles count is increased`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(4)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Обзор новейшего смартфона`,
    announce: `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdAt: `2022-01-09T08:08:28.115Z`,
    categories: [1, 2, 5, 7],
    authorId: 1,
    picture: `picture.png`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

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
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if title is invalid`, () => {
  const newArticle = {
    ...validArticle,
    title: `Обзор новейшего смартфона`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if created date is invalid`, () => {
  const newArticle = {
    ...validArticle,
    createdAt: `20220109T08:08:28.115Z`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if announce is invalid`, () => {
  const newArticle = {
    ...validArticle,
    announce: `Теперь на счету`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if categories are not provided`, () => {
  const newArticle = {
    ...validArticle,
    categories: [],
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if categories are not unique`, () => {
  const newArticle = {
    ...validArticle,
    categories: [1, 1],
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if some category does not exist`, () => {
  const newArticle = {
    ...validArticle,
    categories: [1, 2, 3, 300],
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to create an article if picture is invalid`, () => {
  const newArticle = {
    ...validArticle,
    picture: `invalid.txt`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API changes existent article with given id`, () => {
  const newArticle = {
    title: `Обновленный заголовок. Не стоит идти в программисты, если вам нравятся только игры.`,
    announce: `Теперь на счету 36-летнего россиянина 759 шайб в карьере в НХЛ. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdAt: `2022-01-09T08:08:28.115Z`,
    categories: [1, 9],
    authorId: 1,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/1`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => {
    const createdArticle = {
      ...newArticle,
      categories: newArticle.categories.map((id) => ({
        id,
        name: mockCategories[id - 1],
      })),
    };

    delete createdArticle.authorId;

    expect(response.body).toEqual(expect.objectContaining(createdArticle));
  });

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API returns status code 404 when trying to change article with invalid id`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/INVALID`).send(validArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API returns status code 404 when trying to change non-existent article`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/300`).send(validArticle);
  });

  test(`Status code 404`, () =>
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API returns status code 400 when trying to change an article with invalid data`, () => {
  let app;

  const invalidArticle = {
    title: `Обновленный заголовок`,
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/1`).send(invalidArticle);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API correctly deletes an article with given id`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Status code 204`, () =>
    expect(response.statusCode).toBe(HttpCode.NO_CONTENT));

  test(`Returns no body`, () => expect(response.body).toEqual({}));

  test(`Articles count is decreased`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(2)));
});

describe(`API refuses to delete article by invalid id`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/INVALID`);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});

describe(`API refuses to delete non-existent article`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/300`);
  });

  test(`Status code 404`, () =>
    expect(response.statusCode).toBe(HttpCode.NOT_FOUND));

  test(`Articles count is not changed`, () =>
    request(app)
      .get(`/articles`)
      .expect(({body}) => expect(body.count).toBe(3)));
});
