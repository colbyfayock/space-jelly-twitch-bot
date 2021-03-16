const ApiRequest = require('./models/api-request');
const { getEpisodes, getTodayFromEpisodes, getUpcomingFromEpisodes } = require('./lib/colbyashi-maru');


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

      if ( !today ) throw new Error('Can not find episode for today');

      const { title, name, twitterhandle } = today;

      return `${name} https://twitter.com/${twitterhandle}`;
    }
  },
  host: {
    response: 'Colby Fayock https://twitter.com/colbyfayock'
  },
  spacejelly: {
    response: 'https://spacejelly.dev'
  },
  today: {
    response: async () => {
      const episodes = await getEpisodes();
      const today = getTodayFromEpisodes(episodes);

      if ( !today ) throw new Error('Can not find episode for today');

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

  cmstart: {
    access: ['admin'],
    response: '3... 2... 1... go!',
    onCommand: async () => {
      const request = new ApiRequest('/cm-timer');
      const response = await request.post({
        data: {
          action: 'start'
        }
      });
      return response;
    }
  },
  cmstop: {
    access: ['admin'],
    response: 'Clock officially stopped.',
    onCommand: async () => {
      const request = new ApiRequest('/cm-timer');
      const response = await request.post({
        data: {
          action: 'stop'
        }
      });
      return response;
    }
  },
  cmpause: {
    access: ['admin'],
    response: 'Taking a quick break.',
    onCommand: async () => {
      const request = new ApiRequest('/cm-timer');
      const response = await request.post({
        data: {
          action: 'pause'
        }
      });
      return response;
    }
  }
}