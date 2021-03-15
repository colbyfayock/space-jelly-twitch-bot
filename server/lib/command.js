const { getClient } = require('./twitch');

const regexpCommand = new RegExp(/^(?:sudo\W)?!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const AVAILABLE_COMMANDS = {
  spacejelly: {
    response: 'https://spacejelly.dev'
  }
}

/**
 * getCommand
 */

function getCommand(message) {
  if ( !isCommand(message) ) return;
  const [raw, command, argument] = message.match(regexpCommand);
  return {
    command,
    argument
  };
}

module.exports.getCommand = getCommand;

/**
 * isCommand
 */

function isCommand(message) {
  return regexpCommand.test(message);
}

module.exports.isCommand = isCommand;

/**
 * execCommand
 */

function execCommand({ target, command, argument }) {
  const client = getClient();
  const commandToExec = AVAILABLE_COMMANDS[command];

  if ( commandToExec ) {
    client.say(target, commandToExec.response);
    return true;
  } else {
    client.say(target, `Oops, I don't understand the command !${command} yet!`);
    return false;
  }
}

module.exports.execCommand = execCommand;
