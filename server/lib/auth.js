/**
 * isAuthorized
 */

function isAuthorized({ command, isSudo, user }) {
  if ( user.isAdmin() ) return true;

  const { access } = command;

  if ( access.includes('admin') ) return false;

  if ( access.includes('mod') && user.isMod() ) return false;
  if ( access.includes('subscriber') && user.isSubscriber() ) return false;

  return true;
}

module.exports.isAuthorized = isAuthorized;