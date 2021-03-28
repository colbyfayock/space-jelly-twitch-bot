require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('ws');

const { getClient } = require('./lib/twitch');
const Socket = require('./models/socket');

const intervals = require('./intervals');
const jobs = require('./jobs');

const prefix = `[${process.env.TWITCH_BOT_USERNAME}]`;

/**
 * HTTP
 */

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || process.env.SERVER_PORT;

app.get('/spacejelly', function (req, res) {
  console.log(`${prefix} - HTTP - GET /spacejelly`);
  res.send({
    author: {
      name: 'Colby Fayock',
      url: 'https://twitter.com/colbyfayock'
    },
    name: 'Space Jelly',
    url: 'https://spacejelly.dev/'
  });
});

server.on('request', app);

server.listen(port, () => {
  const datetime = new Date().toISOString();
  console.log(`${prefix} - ${datetime} - HTTP - Server started on port ${port}`);
});

/**
 * Websocket
 */

const socket = new Socket({
  logPrefix: prefix,
  server,
  path: '/ws'
});

/**
 * Twitch Client
 */

const client = getClient();

client.connect();

/**
 * App Config
 * @description Maintains a global interface for server clients
 */

const config = {
  client,
  prefix,
  socket,
  globals: {}
}

/**
 * Intervals
 * @description Time based regularly repeating commands or processes
 */

Object.keys(intervals).forEach(key => {
  const { handler, time } = intervals[key];

  const interval = setInterval(() => {
    if ( typeof handler === 'function' ) {
      handler({
        config,
        interval
      })
    }
  }, time);
});

/**
 * Jobs
 * @description Event-based workflows such as commands handler and sub responses
 */

const events = {};

Object.keys(jobs).forEach(key => {
  const { on, handler } = jobs[key];

  if ( !events[on] ) {
    events[on] = [];
  }

  events[on].push(jobs[key]);
});

Object.keys(events).forEach(eventId => {
  client.on(eventId, async (...args) => {
    events[eventId].forEach(event => {
      const { handler } = event;
      if ( typeof handler === 'function' ) {
        handler(config, ...args)
      }
    })
  });
});