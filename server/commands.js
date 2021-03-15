const fetch = require('node-fetch');

const ApiRequest = require('./models/api-request');

module.exports = {
  spacejelly: {
    response: 'https://spacejelly.dev'
  },
  colbyfayock: {
    response: 'https://twitter.com/colbyfayock'
  },
  cmstart: {
    access: ['admin'],
    response: '3... 2... 1... go!',
    onCommand: async () => {
      const request = new ApiRequest('/cm-timer');
      const response = await request.post({
        data: {
          action: 'start'
        }
      });
      return response;
    }
  },
  cmstop: {
    access: ['admin'],
    response: 'Clock officially stopped.',
    onCommand: async () => {
      const request = new ApiRequest('/cm-timer');
      const response = await request.post({
        data: {
          action: 'stop'
        }
      });
      return response;
    }
  },
  cmpause: {
    access: ['admin'],
    response: 'Taking a quick break.',
    onCommand: async () => {
      const request = new ApiRequest('/cm-timer');
      const response = await request.post({
        data: {
          action: 'pause'
        }
      });
      return response;
    }
  }
}