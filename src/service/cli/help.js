"use strict";

const chalk = require(`chalk`);

const INFO_TEXT = `
Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>

    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --init-db             инициализирует базу данных
    --fill <count>        формирует файл fill-db.sql
    --fill-db <count>     инициализирует и наполняет базу данных моковыми данными
    --server <port>       запускает API сервер
`;

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(INFO_TEXT));
  },
};
