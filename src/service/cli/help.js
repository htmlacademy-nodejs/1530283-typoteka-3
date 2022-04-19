"use strict";

const chalk = require(`chalk`);

const INFO_TEXT = `
Программа запускает API-сервер и инициализирует базу данных для API.

    Гайд:
    service.js <command>

    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --initdb              инициализирует базу данных, создает пустые таблицы без данных
    --filldb <count>      инициализирует и наполняет базу данных моковыми данными
    --server <port>       запускает API сервер
`;

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(INFO_TEXT));
  },
};
