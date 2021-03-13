require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
	connection: {
    reconnect: true
  },
	channels: [
    'trostcodes'
  ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {


  console.log('channel', channel)
  console.log('tags', tags)
  console.log('message', message)
  console.log('self', self)

	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});