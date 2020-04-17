var WebHooks = require('node-webhooks')
 
var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
    httpSuccessCodes: [200, 201, 202, 203, 204], 
})

module.exports = webHooks