const { prefix } = require("../../config.json");
const moment = require("moment-timezone");
const tor = function (timestamp, now) {
	return moment.duration(now - moment(timestamp * 1000)).asSeconds();
};

exports.run = (whats, msg) => {
	reply(`REST Latency: ${tor(msg.messageTimestamp, Date.now())}ms`);
};

exports.help = {
    name: "Ping",
    description: "PONG!",
    category: "Utility",
    usage: `${prefix}ping`,
    cooldown: 5
};