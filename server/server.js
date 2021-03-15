require('dotenv').config();

const fetch = require('node-fetch');

const { getClient } = require('./lib/twitch');
const { getCommand, execCommand } = require('./lib/command');
const { isAuthorized } = require('./lib/auth');

const client = getClient();

client.connect();

client.on('connected', (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});

client.on('message', async (target, context, message) => {
  const datetime = new Date(parseInt('1615657726963')).toISOString();

  const user = {
    badges: context.badges,
    badgesRaw: context['badges-raw'],
    badgeInfo: context['badge-info'],
    badgeInfoRaw: context['badge-info-raw'],
    displayName: context['display-name'],
    id: context['user-id'],
    isMod: context.mod,
    isSubscriber: context.subscriber,
    userType: context['user-type'],
    username: context.username
  }

  const prefix = `[Message] ${datetime} - ${user.id || 'Me'}`;

  console.log(`${prefix} - Message: ${message}`);

  const command = getCommand(message);

  if ( command && isAuthorized(message, user) ) {
    execCommand({
      ...command,
      target
    });
  }
});