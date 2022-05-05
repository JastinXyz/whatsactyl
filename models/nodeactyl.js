const conf = require('../config.json');

// Client
//const Nodeactyl = require('nodeactyl');
//const client = new Nodeactyl.NodeactylClient(conf.host, "YourClientAPIKey");

// Application
const Nodeactyl = require('nodeactyl');
const application = new Nodeactyl.NodeactylApplication(conf.host, conf.application.api_key);

exports.application = application 