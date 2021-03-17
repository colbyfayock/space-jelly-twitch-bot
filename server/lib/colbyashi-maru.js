const fetch = require('node-fetch');

const { sortObjectsByDate, dateIsFuture } = require('./datetime');

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
  return episodes.find(({ date }) => {
    const epiDate = new Date(date);
    const epiMonth = epiDate.getMonth();
    const epiDay = epiDate.getDate();
    const todayDate = new Date();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate() + 2;
    return epiDay === todayDay && epiMonth === todayMonth;
  });
}

module.exports.getTodayFromEpisodes = getTodayFromEpisodes;

/**
 * getUpcomingFromEpisodes
 */

function getUpcomingFromEpisodes(episodes) {
  const sorted = sortObjectsByDate(episodes).reverse();

  const today = getTodayFromEpisodes(sorted);
  const future = sorted.filter(({ date }) => dateIsFuture(date));

  let index = 0;

  if ( today && today.id === future[index].id ) {
    index = index + 1;
  }

  return future[index];
}

module.exports.getUpcomingFromEpisodes = getUpcomingFromEpisodes;