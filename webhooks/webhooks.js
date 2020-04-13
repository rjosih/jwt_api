var WebHooks = require('node-webhooks')
 
// Initialize webhooks module from on-disk database
var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
    httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes
})

module.exports = webHooks