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

/**
 * parseHumanTime
 */

function parseHumanTime(string) {
  const units = {
    'm': 'minutes',
    'min': 'minutes',
    'mins': 'minutes',
    'minutes': 'minutes',
    's': 'seconds',
    'sec': 'seconds',
    'secs': 'seconds',
    'seconds': 'seconds'
  };
  const numbers = [];
  const letters = [];

  string.split('').forEach(char => {
    if ( char === ' ' ) return;

    if ( isNaN(parseInt(char)) ) {
      letters.push(char);
      return;
    }

    if ( letters.length === 0 ) {
      numbers.push(char);
      return;
    }

    const error = new Error('Invalid time. Format is not recognizable.');
    error.name = 'INVALID_TIME_FORMAT';
    throw error;
  });

  const number = parseInt(numbers.join(''));
  const letter = letters.join('');

  const unit = units[letter];

  if ( isNaN(number) ) {
    const error = new Error('Invalid time. Can not recognize number.');
    error.name = 'INVALID_TIME_NUMBER';
    throw error;
  }

  if ( !unit ) {
    const error = new Error('Invalid time. Can not recognize unit.');
    error.name = 'INVALID_TIME_UNIT';
    throw error;
  }

  return {
    number,
    unit
  }
}

module.exports.parseHumanTime = parseHumanTime;