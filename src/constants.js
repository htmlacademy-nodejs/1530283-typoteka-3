'use strict';

const DEFAULT_COMMAND = `--help`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const FilePath = {
  MOCKS: `mocks.json`,
  CATEGORIES: `data/categories.txt`,
  TITLES: `data/titles.txt`,
  SENTENCES: `data/sentences.txt`,
};

module.exports = {
  DEFAULT_COMMAND,
  FilePath,
  ExitCode,
};
