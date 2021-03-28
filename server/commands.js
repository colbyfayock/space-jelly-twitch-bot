const Timer = require('./models/timer');
const { getEpisodes, getTodayFromEpisodes, getUpcomingFromEpisodes } = require('./lib/colbyashi-maru');
const { parseHumanTime } = require('./lib/datetime');

/**
 * @TODO
 * sudo !resource: pop up resource
 *
 */

module.exports = {
  help: {
    response: [
      `
        Colbyashi Maru is a weekly series that pits developers
        against the tools of the web. For upcoming and past
        episodes check out: https://spacejelly.dev/colbyashi-maru
      `,
      'More Commands: !guest !host !spacejelly !today !upcoming'
    ]
  },
  guest: {
    response: async () => {
      const episodes = await getEpisodes();
      const today = getTodayFromEpisodes(episodes);

      if ( !today ) {
        const error = new Error('Can not find episode for today')
        error.name = 'NO_EPISODE';
        throw error;
      }

      const { title, name, twitterhandle } = today;

      return `${name} https://twitter.com/${twitterhandle}`;
    }
  },
  host: {
    response: 'Colby Fayock https://twitter.com/colbyfayock'
  },
  notfound: {
    response: 'Oops, command not found. Try running !help'
  },
  questions: {
    response: '🧐 Have any questions? Make sure to ask away in the chat!'
  },
  spacejelly: {
    response: 'https://spacejelly.dev'
  },
  timeleft: {
    response: ({ config, argument: type }) => {
      const isBot = type === 'bot';
      const { globals } = config;
      const time = globals.cmtimer.timeLeft;

      const secondsLeft = time / 1000;
      const secondsLeftFloor = Math.floor(secondsLeft);
      const minutesLeft = secondsLeftFloor / 60;
      const minutesLeftFloor = Math.floor(minutesLeft);

      const minuteIntervals = [ 45, 30, 15, 10, 5 ];

      if ( secondsLeft < 1 ) {
        return `👾 GAME OVER 👾 GAME OVER 👾 GAME OVER 👾 GAME OVER 👾 GAME OVER 👾`
      }

      if ( minuteIntervals.includes(minutesLeft) ) {
        return `${minutesLeft} minutes remaining!`
      }

      if ( secondsLeftFloor < 11 ) {
        return `${secondsLeftFloor} seconds remaining!`
      }

      if ( isBot ) return;

      const seconds = secondsLeftFloor - (minutesLeftFloor * 60);

      return `${minutesLeftFloor} minutes and ${seconds} seconds left!`;
    },
    onCommand: ({ config }) => {
      const { socket, globals } = config;
      const time = globals.cmtimer.timeLeft;

      socket.broadcast({
        type: 'command',
        command: 'timeleft',
        data: {
          time
        }
      })
    }
  },
  today: {
    response: async () => {
      const episodes = await getEpisodes();
      const today = getTodayFromEpisodes(episodes);

      if ( !today ) {
        const error = new Error('Can not find episode for today')
        error.name = 'NO_EPISODE';
        throw error;
      }

      const { title, name, twitterhandle } = today;

      return `Today, ${name} is facing off against ${title}! https://twitter.com/${twitterhandle}`;
    }
  },
  upcoming: {
    response: async () => {
      const episodes = await getEpisodes();
      const upcoming = getUpcomingFromEpisodes(episodes);

      if ( !upcoming ) throw new Error('Can not find episode for upcoming');

      const { title, name, twitterhandle, date } = upcoming;

      return `
        Next time on Colbyashi Maru, ${name} is facing off against ${title}!

        Find more info and past episodes at https://spacejelly.dev/colbyashi-maru
      `;
    }
  },

  /**
   * Colbyashi Maru Timer
   */

  cmadd: {
    access: ['admin'],
    response: ({ argument: time }) => {
      const timeToAdd = parseHumanTime(time);
      return `Adding ${timeToAdd.number} ${timeToAdd.unit} to the clock!`
    },
    onCommand: ({ argument: time, config }) => {
      const timeToAdd = parseHumanTime(time);

      if ( !config.globals.cmtimer || !config.globals.cmtimer.isActive) {
        const error = new Error('Failed to add time: No active timer');
        error.name = 'NO_ACTIVE_TIMER';
        throw error;
      }

      if ( timeToAdd.unit === 'seconds' ) {
        config.globals.cmtimer.add(timeToAdd.number * 1000);
      } else if ( timeToAdd.unit === 'minutes' ) {
        config.globals.cmtimer.add(timeToAdd.number * 60 * 1000);
      }
    }
  },
  cmstart: {
    access: ['admin'],
    response: [
      '60 minutes on the clock!',
      `3... 2... 1... Let's gooooo!`
    ],
    onCommand: ({ config }) => {
      if ( config.globals.cmtimer ) {
        config.globals.cmtimer.start();
        return;
      }

      config.globals.cmtimer = new Timer(60 * 60 * 1000);
      config.globals.cmtimer.start();
    }
  },
  cmpause: {
    access: ['admin'],
    response: 'Taking a quick break.',
    onCommand: async ({ config }) => {
      config.globals.cmtimer.stop();
    }
  },
  cmremove: {
    access: ['admin'],
    response: ({ argument: time }) => {
      const timeToAdd = parseHumanTime(time);
      return `Removing ${timeToAdd.number} ${timeToAdd.unit} from the clock!`
    },
    onCommand: ({ argument: time, config }) => {
      const timeToAdd = parseHumanTime(time);

      if ( !config.globals.cmtimer || !config.globals.cmtimer.isActive) {
        const error = new Error('Failed to remove time: No active timer');
        error.name = 'NO_ACTIVE_TIMER';
        throw error;
      }

      if ( timeToAdd.unit === 'seconds' ) {
        config.globals.cmtimer.remove(timeToAdd.number * 1000);
      } else if ( timeToAdd.unit === 'minutes' ) {
        config.globals.cmtimer.remove(timeToAdd.number * 60 * 1000);
      }
    }
  },
  cmstop: {
    access: ['admin'],
    response: 'Clock officially stopped.',
    onCommand: ({ config }) => {
      config.globals.cmtimer = null;
    }
  }
}