const fetch = require('node-fetch');

const { findNextAfterToday, findToday } = require('./datetime');

/**
 * getEpisodes
 */

async function getEpisodes() {
  const request = await fetch('https://spacejelly.dev/colbyashi-maru.json');
  const { episodes } = await request.json();
  return episodes;
}

module.exports.getEpisodes = getEpisodes;

/**
 * getTodayFromEpisodes
 */

function getTodayFromEpisodes(episodes) {
  const episode = findToday(episodes);
  return episode;
}

module.exports.getTodayFromEpisodes = getTodayFromEpisodes;

/**
 * getUpcomingFromEpisodes
 */

function getUpcomingFromEpisodes(episodes) {
  const episode = findNextAfterToday(episodes);
  return episode;
}

module.exports.getUpcomingFromEpisodes = getUpcomingFromEpisodes;