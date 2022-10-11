const sdk = require('api')('@scale-ai/v1.1#19el2i36l8xk43rr');
const keys = require('../api-keys.json');

sdk.auth(keys.live);
sdk.batchList({
  project: 'Traffic Sign Detection',
  status: 'in_progress',
  start_time: '2020-05-21',
  end_time: '2021-01-01',
  limit: '100',
  offset: '0'
})
  .then(res => console.log(res))
  .catch(err => console.error(err));