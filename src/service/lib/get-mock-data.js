'use strict';

const chalk = require(`chalk`);
const {readFile} = require(`../../utils`);
const {FilePath, FileType} = require(`../../constants`);

let data = null;

const getMockData = async () => {
  if (data) {
    return data;
  }

  try {
    data = await readFile(FilePath.MOCKS, FileType.JSON);
  } catch (err) {
    console.error(chalk.red(err));
    return (err);
  }

  return data;
};

module.exports = getMockData;
