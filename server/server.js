require('dotenv').config();

const { getClient } = require('./lib/twitch');
const { getCommandFromMessage, execCommand } = require('./lib/command');
const User = require('./models/user');

const prefix = `[${process.env.TWITCH_BOT_USERNAME}]`;

/**
 * Twitch Client
 */

const client = getClient();

client.connect();

client.on('connected', (addr, port) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - Connected to ${addr}:${port} in channels ${process.env.TWITCH_CHANNELS}`);
});

client.on('message', async (target, context, message) => {
  const datetime = new Date().toISOString();

  const user = new User().ingestFromContext(context);

  const command = getCommandFromMessage(message);

  if ( command ) {
    console.log(`${prefix} - ${datetime} - ${user.id} - Command: ${message}`);

    await execCommand({
      ...command,
      target,
      user
    });
  }
});