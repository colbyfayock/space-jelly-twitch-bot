require('dotenv').config();

const { getClient } = require('./lib/twitch');
const { getCommandFromMessage, execCommand } = require('./lib/command');
const User = require('./models/user');

const prefix = `[${process.env.TWITCH_BOT_USERNAME}]`;

const hellos = [
  'Hey',
  'Welcome',
  'Greetings',
  'You made it',
  'Howdy',
  'Yo',
  'Hey there',
  'Ahoy',
  'Hello',
  'Hey hey'
];

const HELP_INTERVAL = 60 * 15 * 1000;

/**
 * Twitch Client
 */

const client = getClient();

client.connect();

/**
 * Help Poll
 * @description Regularly ping connected channels with !help command per HELP_INTERVAL
 */

setInterval(async () => {
  const datetime = new Date().toISOString();

  const { channels, userstate } = client;

  channels.forEach(async channel => {
    const user = new User().ingestFromContext(userstate[channel]);
    await execCommand({
      command: 'help',
      channel,
      user
    });
  });

  console.log(`${prefix} - ${datetime} - Helping channels ${channels.join(', ')}`);
}, HELP_INTERVAL);

/**
 * Event: connected
 */

client.on('connected', (addr, port) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - Connected to ${addr}:${port} in channels ${process.env.TWITCH_CHANNELS}`);
});

/**
 * Event: message
 */

client.on('message', async (channel, context, message) => {
  const datetime = new Date().toISOString();

  const user = new User().ingestFromContext(context);

  const command = getCommandFromMessage(message);

  console.log(`${prefix} - ${datetime} - ${user.id} - Message: ${message}`);

  if ( command ) {
    await execCommand({
      ...command,
      channel,
      user
    });
    console.log(`${prefix} - ${datetime} - ${user.id} - Command: ${JSON.stringify(command)}`);
  }
});

/**
 * Event: subscription
 */

client.on('subscription', (channel, userName, methods, message, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - subscription - ${userName} = ${methods} - ${message}`);
  client.say(channel, `Thanks ${userName} for the sub!`);
});

/**
 * Event: join
 */

client.on('join', (channel, userName) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - join - ${userName}`);
});

/**
 * Event: cheer
 */

client.on('cheer', (channel, tags, message) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - cheer - ${message}`);
});

/**
 * Event: redeem
 */

client.on('redeem', (channel, userName, type, tags, message) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - redeem - ${userName} - ${type} - ${message}`);
});

/**
 * Event: subgift
 */

client.on('subgift', (channel, userName, streakMonths, recipient, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - subgift - ${userName} - ${streakMonths} - ${recipient} - ${methods}`);
});

/**
 * Event: anonsubgift
 */

client.on('anonsubgift', (channel, streakMonths, recipient, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - anonsubgift - ${streakMonths} - ${recipient} - ${methods}`);
});

/**
 * Event: submysterygift
 */

client.on('submysterygift', (channel, userName, giftSubCount, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - submysterygift - ${userName} - ${giftSubCount} - ${methods}`);
});

/**
 * Event: anonsubmysterygift
 */

client.on('anonsubmysterygift', (channel, giftSubCount, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - anonsubmysterygift - ${giftSubCount} - ${methods}`);
});

/**
 * Event: primepaidupgrade
 */

client.on('primepaidupgrade', (channel, userName, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - primepaidupgrade - ${userName} - ${methods}`);
});

/**
 * Event: giftpaidupgrade
 */

client.on('giftpaidupgrade', (channel, userName, sender, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - giftpaidupgrade - ${userName} - ${sender}`);
});

/**
 * Event: anongiftpaidupgrade
 */

client.on('anongiftpaidupgrade', (channel, userName, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - anongiftpaidupgrade - ${userName}`);
});

/**
 * Event: raid
 */

client.on('raid', (channel, userName, viewers, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - raid - ${userName} - ${viewers}`);
});

/**
 * Event: ritual
 */

client.on('ritual', (ritualName, channel, userName, tags, message) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - ritual - ${ritualName}`);
});