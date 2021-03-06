const { Server } = require('ws');



class Socket {
  constructor({ server, logPrefix, path } = {}) {
    this.logPrefix = logPrefix;
    this.start({
      server,
      path
    });
  }

  start({ server, path }) {
    this.server = new Server({
      server,
      path
    });

    this.server.on('connection', () => {
      const datetime = new Date().toISOString();
      console.log(`${this.logPrefix} - ${datetime} - Socket - Connected`);
    });

    this.server.on('close', () => {
      const datetime = new Date().toISOString();
      console.log(`${this.logPrefix} - ${datetime} - Socket - Disconnected`);
    });
  }

  broadcast(data) {
    const datetime = new Date().toISOString();

    if ( !this.server ) {
      console.log(`${this.logPrefix} - ${datetime} - Socket - Failed to broadcast: No server available.`);
    }

    const payload = {
      data,
      time: datetime
    }

    this.server.clients.forEach(client => {
      client.send(JSON.stringify(payload));
    });

    console.log(`${this.logPrefix} - ${datetime} - Socket - Broadcast: ${JSON.stringify(payload)}`)
  }

}

module.exports = Socket;