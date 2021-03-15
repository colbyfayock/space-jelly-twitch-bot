class User {
  constructor() {}

  ingestFromContext(context) {
    this.badges = context.badges;
    this.badgesRaw = context['badges-raw'];
    this.badgeInfo = context['badge-info'];
    this.badgeInfoRaw = context['badge-info-raw'];
    this.displayName = context['display-name'];
    this.id = context['user-id'];
    this.mod = context.mod;
    this.subscriber = context.subscriber;
    this.userType = context['user-type'];
    this.username = context.username;

    if ( !this.id && process.env.TWITCH_BOT_USERNAME === this.username ) {
      this.id = this.username;
    }

    return this;
  }

  isAdmin() {
    const admins = process.env.TWITCH_CHANNEL_ADMINS.split(',');
    return admins.includes(this.username);
  }

  isMod() {
    return this.mod;
  }

  isSubscriber() {
    return this.subscriber;
  }
}

module.exports = User;