const fetch = require('node-fetch');

class ApiRequest {
  constructor(path) {
    this.endpoint = `${process.env.API_ENDPOINT}${path}`;
  }

  post({ data, headers }) {
    return fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${process.env.APP_SECRET}`,
        ...headers
      }
    })
  }
}

module.exports = ApiRequest;