const { getCommandFromMessage, execCommand } = require('./lib/command');
const User = require('./models/user');

module.exports = {

  /**
   * Help
   * @description Regularly ping connected channels with !help command
   */

  help: {
    init: async ({ config = {} } = {}) => {
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
    time: 60 * 30 * 1000
  },

  /**
   * Questions
   * @description
   */

  questions: {
    init: async ({ config = {} } = {}) => {
      const { client, prefix } = config;
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
    time: 60 * 15 * 1000
  },

  timeleft: {
    init: async ({ config = {} } = {}) => {
      const { client, prefix, globals } = config;
      const { channels, userstate } = client;
      const datetime = new Date().toISOString();

      console.log(`${prefix} - ${datetime} - Time left for channels ${channels.join(', ')}`);

      if ( globals.cmtimer && globals.cmtimer.isActive ) {
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
      }
    },
    time: 1000
  }

}