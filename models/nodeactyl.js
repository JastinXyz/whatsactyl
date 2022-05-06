const conf = require("../config.json");

// Application
const Nodeactyl = require("nodeactyl");
const application = new Nodeactyl.NodeactylApplication(
  conf.host,
  conf.application.api_key
);

exports.application = application;
