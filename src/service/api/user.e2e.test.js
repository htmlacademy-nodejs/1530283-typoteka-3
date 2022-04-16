"use strict";

const Sequelize = require(`sequelize`);
const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);

const passwordService = require(`../lib/password-service`);
const initDB = require(`../lib/init-db`);

const user = require(`./user`);
const UserService = require(`../data-service/user-service`);

const mockPassword = `password`;

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
    passwordHash: passwordService.hashSync(mockPassword),
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

  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });
  user(app, new UserService(mockDB));

  return app;
};

const validUser = {
  firstName: `Тест Test`,
  lastName: `Тест Test`,
  email: `test@example.com`,
  password: `valid_password`,
  passwordRepeated: `valid_password`,
  avatar: `avatar.jpg`,
};

describe(`API creates new user if data is valid`, () => {
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(validUser);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create new user if required data is absent`, () => {
  const userWithoutAvatar = {
    ...validUser,
  };

  delete userWithoutAvatar.avatar;

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(userWithoutAvatar)) {
      const badUser = {...userWithoutAvatar};
      delete badUser[key];
      await request(app)
        .post(`/user`)
        .send(badUser)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API refuses to create new user if first name is invalid`, () => {
  const invalidUser = {
    ...validUser,
    firstName: `1 &`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to create new user if last name is invalid`, () => {
  const invalidUser = {
    ...validUser,
    lastName: `1 &`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to create new user if email is invalid`, () => {
  const invalidUser = {
    ...validUser,
    email: `com.invalid@mail`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to create new user if email is non-unique`, () => {
  const invalidUser = {
    ...validUser,
    email: `ivanov@example.com`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to create new user if password is invalid`, () => {
  const invalidUser = {
    ...validUser,
    password: `inval`,
    passwordRepeated: `inval`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to create new user if repeated password is invalid`, () => {
  const invalidUser = {
    ...validUser,
    passwordRepeated: `invalid_password`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to create new user if avatar is invalid`, () => {
  const invalidUser = {
    ...validUser,
    avatar: `invalid_avatar`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user`).send(invalidUser);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

const validAuthData = {
  email: `ivanov@example.com`,
  password: mockPassword,
};

describe(`API returns user if auth data is correct`, () => {
  const userData = {
    ...mockUsers[0]
  };

  delete userData.passwordHash;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(validAuthData);
  });

  test(`Status code 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns user data`, () =>
    expect(response.body).toEqual(expect.objectContaining(userData)));
});

describe(`API refuses to auth if no e-mail is provided`, () => {
  const invalidAuthData = {
    ...validAuthData,
    email: ``,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(invalidAuthData);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to auth if no e-mail is invalid`, () => {
  const invalidAuthData = {
    ...validAuthData,
    email: `email`,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(invalidAuthData);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to auth if no password is provided`, () => {
  const invalidAuthData = {
    ...validAuthData,
    password: ``,
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(invalidAuthData);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to auth if user is not registered`, () => {
  const invalidAuthData = {
    ...validAuthData,
    email: `email@absent.com`
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(invalidAuthData);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});

describe(`API refuses to auth if password is incorrect`, () => {
  const invalidAuthData = {
    ...validAuthData,
    password: `invalid_password`
  };

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/user/auth`).send(invalidAuthData);
  });

  test(`Status code 400`, () =>
    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});
