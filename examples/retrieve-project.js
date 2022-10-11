const sdk = require('api')('@scale-ai/v1.1#1pdgi3tl8xk4581');
const keys = require('../api-keys.json');

sdk.auth(keys.live);
sdk.projectRetrieval({Name: 'Traffic Sign Detection'})
  .then(res => console.log(res))
  .catch(err => console.error(err));