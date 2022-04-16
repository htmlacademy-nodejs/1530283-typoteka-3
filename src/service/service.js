'use strict';

const {
  DEFAULT_COMMAND,
  ExitCode
} = require(`../constants`);

const Cli = require(`./cli`);

const [,, ...userArguments] = process.argv;
const [userCommand, ...commandParameters] = userArguments;

const isUserCommandUnknown = !Cli[userCommand];

if (isUserCommandUnknown) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.SUCCESS);
}

Cli[userCommand].run(commandParameters);
