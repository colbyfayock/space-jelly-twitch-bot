/**
 * sortObjectsByDate
 */

function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

module.exports.sortObjectsByDate = sortObjectsByDate;

/**
 * dateIsPast
 */

function dateIsPast(date, offset = 0) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date < new Date(new Date().getTime() + offset);
}

module.exports.dateIsPast = dateIsPast;

/**
 * dateIsFuture
 */

function dateIsFuture(date, offset = 0) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date > new Date(new Date().getTime() + offset);
}

module.exports.dateIsFuture = dateIsFuture;
