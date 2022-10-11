const sdk = require('api')('@scale-ai/v1.1#1pdgi3tl8xk4581');
const keys = require('../api-keys.json');

sdk.auth(keys.test);
sdk.listAllProjects()
  .then(res => {
    res.map(project => {
        console.log(project.name)
    })
  })
  .catch(err => console.error(err));