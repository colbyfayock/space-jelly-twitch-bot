const { getClient } = require('./twitch');
const { isAuthorized } = require('./auth');

const regexpCommand = new RegExp(/^(?:sudo\W)?!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const regexpSudo = new RegExp(/^sudo/);

const AVAILABLE_COMMANDS = require('../commands');

/**
 * getCommandFromMessage
 */

function getCommandFromMessage(message) {
  if ( !isCommand(message) ) return;
  const [raw, command, argument] = message.match(regexpCommand);
  const isSudo = regexpSudo.test(message);
  return {
    command,
    argument,
    isSudo
  };
}

module.exports.getCommandFromMessage = getCommandFromMessage;

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

async function execCommand({ command, argument, isSudo, target, user } = {}) {
  const client = getClient();
  const commandToExec = AVAILABLE_COMMANDS[command];

  if ( !isAuthorized({ command: commandToExec, isSudo, user }) ) {
    client.say(target, `Oops, you don't have access to run !${command}!`);
    return false;
  }

  const { onCommand } = commandToExec;

  if ( typeof onCommand === 'function' ) {
    await onCommand({
      argument,
      user
    });
  }

  if ( commandToExec ) {

    let response = commandToExec && commandToExec.response;

    if ( typeof commandToExec.response == 'function') {
      try {
        response = await commandToExec.response({
          argument,
          user
        });
      } catch(e) {
        console.log(`Error executing command: ${e}`);
        response = 'Oops, something went wrong attemping that command.';
      }
    }

    if ( !Array.isArray(response) ) {
      response = [response];
    }

    response.forEach(r => client.say(target, r));

    return true;
  } else {
    client.say(target, `Oops, I don't understand the command !${command} yet!`);
    return false;
  }
}

module.exports.execCommand = execCommand;