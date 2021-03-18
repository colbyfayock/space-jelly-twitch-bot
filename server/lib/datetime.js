const {
  addDays,
  compareAsc,
  format,
  isEqual,
  isFuture,
  isPast,
  isToday,
  isValid,
  parseISO,
  startOfDay,
  startOfToday
} = require('date-fns');

/**
 * sortObjectsByDate
 */

function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => {
    const parsedA = parseISO(a[key]);
    const parsedB = parseISO(b[key]);
    return compareAsc(parsedA, parsedB)
  });
}

module.exports.sortObjectsByDate = sortObjectsByDate;

/**
 * dateIsPast
 */

function dateIsPast(date) {
  let parsed = date;

  if ( !isValid(parsed) ) {
    parsed = parseISO(parsed);
  }

  return isPast(parsed);
}

module.exports.dateIsPast = dateIsPast;

/**
 * dateIsFuture
 */

function dateIsFuture(date) {
  let parsed = date;

  if ( !isValid(parsed) ) {
    parsed = parseISO(parsed);
  }

  return isFuture(parsed);
}

module.exports.dateIsFuture = dateIsFuture;

/**
 * findToday
 */

function findToday(items, key = 'date') {
  return items.find(item => {
    const date = item[key];
    const parsed = parseISO(date);
    const startOfDate = startOfDay(parsed);
    return isEqual(startOfDate, startOfToday())
  });
}

module.exports.findToday = findToday;

/**
 * findNextAfterToday
 */

function findNextAfterToday(items, key = 'date') {
  const sorted = sortObjectsByDate(items);

  return sorted.find(item => {
    const date = item[key];
    const parsed = parseISO(date);

    if ( isToday(parsed) ) return;

    const dayAfter = addDays(startOfDay(parsed), 1);
    const isFuture = dateIsFuture(dayAfter);

    return isFuture;
  });
}

module.exports.findNextAfterToday = findNextAfterToday;