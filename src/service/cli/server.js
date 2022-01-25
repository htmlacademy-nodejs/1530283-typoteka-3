"use strict";

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;

const {HttpCode, FilePath, ExitCode} = require(`../../constants`);

const ROOT_PATH = `/`;
const DEFAULT_PORT = 3000;
const NOT_FOUND_MESSAGE = `Not found`;

const getTemplate = (message) => `
<!Doctype html>
  <html lang="ru">
  <head>
    <title>First server</title>
  </head>
  <body>${message}</body>
</html>`.trim();

const getMessage = (articles) => {
  const items = articles.map((article) => `<li>${article.title}</li>`).join(``);
  return `<ul>${items}</ul>`;
};

const sendResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, {
    "Content-Type": `text/html; charset=UTF-8`,
  });

  res.end(getTemplate(message));
};

const sendNotFoundResponse = (res) => {
  sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case ROOT_PATH:
      try {
        const rawContent = await fs.readFile(FilePath.MOCKS);
        const articles = JSON.parse(rawContent);
        sendResponse(res, HttpCode.OK, getMessage(articles));
      } catch (err) {
        sendNotFoundResponse(res);
      }

      break;
    default:
      sendNotFoundResponse(res);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [rawPort] = args;
    const port = Number.parseInt(rawPort, 10) || DEFAULT_PORT;

    http
      .createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Сервер остановлен из-за ошибки: ${message}`));
        process.exit(ExitCode.ERROR);
      });
  },
};
