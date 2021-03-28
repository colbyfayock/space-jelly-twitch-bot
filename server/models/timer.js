class Timer {
  constructor(defaultTime) {
    this.starting = defaultTime;
    this.remaining = this.starting;
    this.end = null;
  }

  start() {
    const currentTime = Date.now();
    this.end = currentTime + this.remaining;
  }

  stop() {
    const currentTime = Date.now();

    this.remaining = this.end - currentTime;

    if ( this.remaining <= 0 ) {
      this.remaining = 0;
    }

    this.end = null;
  }

  reset() {
    this.remaining = this.starting;
    this.end = null;
  }

  add(time) {
    if ( this.end ) {
      this.end = this.end + time;
    } else {
      this.remaining = this.remaining + time;
    }
  }

  remove(time) {
    if ( this.end ) {
      this.end = this.end - time;
    } else {
      this.remaining = this.remaining - time;
    }
  }

  get isActive() {
    return this.timeLeft > 0 && typeof this.end === 'number';
  }

  get timeLeft() {
    if ( !this.end ) return this.remaining;

    const currentTime = Date.now();
    const timeLeft = this.end - currentTime;

    this.remaining = timeLeft;

    if ( this.remaining <= 0 ) {
      this.stop();
    }

    return this.remaining;
  }
}

module.exports = Timer;