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
]

/**
 * Twitch Client
 */

const client = getClient();

client.connect();

client.on('connected', (addr, port) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - Connected to ${addr}:${port} in channels ${process.env.TWITCH_CHANNELS}`);
});

client.on('message', async (channel, context, message) => {
  const datetime = new Date().toISOString();

  const user = new User().ingestFromContext(context);

  const command = getCommandFromMessage(message);

  if ( command ) {
    console.log(`${prefix} - ${datetime} - ${user.id} - Command: ${message}`);

    await execCommand({
      ...command,
      channel,
      user
    });
  }
});

client.on('subscription', (channel, userName, methods, message, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - subscription - ${userName} = ${methods} - ${message}`);
  client.say(channel, `Thanks ${userName} for the sub!`);
});

client.on('join', (channel, userName) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - join - ${userName}`);

  if ( userName === process.env.TWITCH_BOT_USERNAME ) return;

  const hello = hellos[Math.floor(Math.random() * hellos.length)];

  client.say(channel, `${hello} ${userName}!`);
});

client.on('cheer', (channel, tags, message) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - cheer - ${message}`);
});

client.on('redeem', (channel, userName, type, tags, message) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - redeem - ${userName} - ${type} - ${message}`);
});

client.on('subgift', (channel, userName, streakMonths, recipient, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - subgift - ${userName} - ${streakMonths} - ${recipient} - ${methods}`);
});

client.on('anonsubgift', (channel, streakMonths, recipient, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - anonsubgift - ${streakMonths} - ${recipient} - ${methods}`);
});

client.on('submysterygift', (channel, userName, giftSubCount, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - submysterygift - ${userName} - ${giftSubCount} - ${methods}`);
});

client.on('anonsubmysterygift', (channel, giftSubCount, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - anonsubmysterygift - ${giftSubCount} - ${methods}`);
});

client.on('primepaidupgrade', (channel, userName, methods, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - primepaidupgrade - ${userName} - ${methods}`);
});

client.on('giftpaidupgrade', (channel, userName, sender, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - giftpaidupgrade - ${userName} - ${sender}`);
});

client.on('anongiftpaidupgrade', (channel, userName, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - anongiftpaidupgrade - ${userName}`);
});

client.on('raid', (channel, userName, viewers, tags) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - raid - ${userName} - ${viewers}`);
});

client.on('ritual', (ritualName, channel, userName, tags, message) => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - ritual - ${ritualName}`);
});