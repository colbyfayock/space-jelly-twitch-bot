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

async function execCommand({ command, argument, isSudo, channel, user, config } = {}) {
  const client = getClient();
  let commandToExec = AVAILABLE_COMMANDS[command];

  if ( !commandToExec ) {
    commandToExec = AVAILABLE_COMMANDS.notfound;
  }

  if ( !isAuthorized({ command: commandToExec, isSudo, user }) ) {
    client.say(channel, `Oops, you don't have access to run !${command}!`);
    return false;
  }

  const { onCommand } = commandToExec;

  if ( typeof onCommand === 'function' ) {
    try {
      await onCommand({
        argument,
        user,
        config
      });
    } catch(e) {
      console.log(`Error executing command: ${e}`);

      console.log('e.name', e.name);

      if ( e.name === 'TIMER_EXISTS' ) {
        client.say(channel, 'A timer was already started! Try stopping the existing one first.');
      } else if ( e.name === 'INVALID_TIME_FORMAT' || e.name === 'INVALID_TIME_UNIT' || e.name === 'INVALID_TIME_NUMBER' ) {
        client.say(channel, 'Hm... something looks wrong with the time format!');
      } else if ( e.name === 'NO_ACTIVE_TIMER' ) {
        client.say(channel, 'Uh oh, there are no active timers running!');
      } else {
        client.say(channel, 'Oops, something went wrong attemping that command.');
      }

      return;
    }
  }

  if ( commandToExec ) {

    let response = commandToExec && commandToExec.response;

    if ( typeof commandToExec.response == 'function') {
      try {
        response = await commandToExec.response({
          argument,
          user,
          config
        });
      } catch(e) {
        console.log(`Error executing command: ${e}`);
        if ( e.name === 'NO_EPISODE' ) {
          response = 'No episode playing at the moment. Check back later or see whats coming with !upcoming.'
        } else {
          response = 'Oops, something went wrong attemping that command.';
        }
      }
    }

    if ( !response ) return false;

    if ( !Array.isArray(response) ) {
      response = [response];
    }

    response.forEach((r, index) => {
      setTimeout(() => {
        client.say(channel, r)
      }, index * 200);
    });

    return true;
  } else {
    client.say(channel, `Oops, I don't understand the command !${command} yet!`);
    return false;
  }
}

module.exports.execCommand = execCommand;