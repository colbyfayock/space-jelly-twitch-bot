const regexpSudo = new RegExp(/^sudo/);

const admins = [
  'colbyfayock',
  'colbyashitest'
];

/**
 * isAuthorized
 */

function isAuthorized(message, { displayName, isMod }) {
  if ( !regexpSudo.test(message) ) return true;
  return admins.includes(displayName.toLowerCase()) || isMod;
}

module.exports.isAuthorized = isAuthorized;