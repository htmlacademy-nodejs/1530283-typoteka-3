'use strict';

const MAX_ID_LENGTH = 6;

const DEFAULT_COMMAND = `--help`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const FilePath = {
  FILL_DB: `fill-db.sql`,
  MOCKS: `mocks.json`,
  CATEGORIES: `data/categories.txt`,
  TITLES: `data/titles.txt`,
  SENTENCES: `data/sentences.txt`,
  COMMENTS: `data/comments.txt`,
  PICTURES: `data/pictures.txt`,
};

const HttpError = {
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

const HttpMethod = {
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const FileType = {
  TEXT: `txt`,
  JSON: `json`,
};

const Environment = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  DEFAULT_COMMAND,
  MAX_ID_LENGTH,
  FilePath,
  ExitCode,
  HttpCode,
  HttpError,
  HttpMethod,
  FileType,
  Environment
};
