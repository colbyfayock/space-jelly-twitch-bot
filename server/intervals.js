const fetch = require('node-fetch');

const { getCommandFromMessage, execCommand } = require('./lib/command');
const User = require('./models/user');

const SECONDS_TO_MS_MULTIPLIER = 1000;
const MINUTES_TO_MS_MULTIPLIER = 60 * 1000;

module.exports = {

  /**
   * Help
   * @description Regularly ping connected channels with !help command
   */

  help: {
    handler: async ({ config = {} } = {}) => {
      const { client, prefix } = config;
      const { channels, userstate } = client;
      const datetime = new Date().toISOString();

      console.log(`${prefix} - ${datetime} - Helping channels ${channels.join(', ')}`);

      channels.forEach(async channel => {
        const user = new User().ingestFromContext(userstate[channel]);
        await execCommand({
          command: 'help',
          channel,
          user,
          config
        });
      });
    },
    time: 30 * MINUTES_TO_MS_MULTIPLIER
  },

  /**
   * keepalive
   * @description Regularly self-ping to keep Heroku instance alive
   */

  keepalive: {
    handler: async ({ config = {} } = {}) => {
      const { prefix } = config;
      const datetime = new Date().toISOString();

      try {
        const data = await fetch(`${process.env.SERVER_ENDPOINT}/spacejelly`);
        const { name } = await data.json();

        if ( name !== 'Space Jelly' ) {
          throw new Error('Body is not valid');
        }

        console.log(`${prefix} - ${datetime} - Keeping server alive`);
      } catch(e) {
        console.log(`${prefix} - ${datetime} - Failed to keep server alive: ${e}`);
        throw e;
      }
    },
    time: 10 * MINUTES_TO_MS_MULTIPLIER
  },

  /**
   * Questions
   * @description
   */

  questions: {
    handler: async ({ config = {} } = {}) => {
      const { client, prefix, globals } = config;
      const { channels, userstate } = client;
      const datetime = new Date().toISOString();

      console.log(`${prefix} - ${datetime} - Prompting questions for channels ${channels.join(', ')}`);

      if ( globals.cmtimer && globals.cmtimer.isActive ) {
        channels.forEach(async channel => {
          const user = new User().ingestFromContext(userstate[channel]);
          await execCommand({
            command: 'questions',
            channel,
            user,
            config
          });
        });
      }
    },
    time: 15 * MINUTES_TO_MS_MULTIPLIER
  },

  timeleft: {
    handler: async ({ config = {} } = {}) => {
      const { client, prefix, globals } = config;
      const { channels, userstate } = client;
      const datetime = new Date().toISOString();

      if ( globals.cmtimer && globals.cmtimer.isActive ) {
        console.log(`${prefix} - ${datetime} - Time left for channels ${channels.join(', ')}`);

        channels.forEach(async channel => {
          const user = new User().ingestFromContext(userstate[channel]);
          await execCommand({
            command: 'timeleft',
            argument: 'bot',
            channel,
            user,
            config
          });
        });

        if ( globals.cmtimer.timeleft <= 0 ) {
          globals.cmtimer.stop();
        }
      }
    },
    time: 1 * SECONDS_TO_MS_MULTIPLIER
  }

}