'use strict';

const DEFAULT_COMMAND = `--help`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const FilePath = {
  MOCKS: `mocks.json`,
  CATEGORIES: `data/categories.txt`,
  TITLES: `data/titles.txt`,
  SENTENCES: `data/sentences.txt`,
};

const Error = {
  CLIENT: {
    code: HttpCode.NOT_FOUND,
    title: `Похоже ошиблись адресом`
  },
  SERVER: {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    title: `Что-то пошло не так`,
    text: `Причин может быть много: сервер не выдержал нагрузку или в коде ошибка. Попробуйте повторить попытку позже.`
  }
};

module.exports = {
  DEFAULT_COMMAND,
  FilePath,
  ExitCode,
  HttpCode,
  Error
};
