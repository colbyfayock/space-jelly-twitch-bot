/**
 * TWITCH_OAUTH_TOKEN: Get an auth token for Twitch at https://twitchapps.com/tmi/
 */

const tmi = require('tmi.js');

/**
 * getClient
 */

let client;

function getClient({ channels = [] } = {}) {

  const defaultChannels = process.env.TWITCH_CHANNELS.split(',');

  if ( !client ) {
    client = new tmi.Client({
      channels: [
        ...defaultChannels,
        ...channels
      ],
      connection: {
        reconnect: true
      },
      identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
      }
    });
  }

  return client;
}

module.exports.getClient = getClient;