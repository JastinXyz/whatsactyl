const { prefix } = require("../config.json");

exports.run = (whats, msg) => {
    whats.sendMessage(msg.key.remoteJid, { text: `REST Latency: ${Date.now() - msg.messageTimestamp}ms` });
};

exports.help = {
    name: "Ping",
    description: "PONG!",
    usage: `${prefix}ping`,
    cooldown: 5
};