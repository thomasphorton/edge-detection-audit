const fs = require('fs');
const sdk = require('api')('@scale-ai/v1.1#xj1m535l8xk48lb');
const keys = require('../api-keys.json');

sdk.auth(keys.live);
sdk.listMultipleTasks({
  type: 'annotation',
  status: 'completed',
  project: 'Traffic Sign Detection',
  limit: '100',
  include_attachment_url: 'true'
})
  .then(res => {
    console.log(res.docs.length);
    // fs.writeFileSync(`./examples/responses/list-tasks-response.json`, JSON.stringify(res))
    // console.log(res.docs[0].params.attachment)
  })
  .catch(err => console.error(err));