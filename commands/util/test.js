const { prefix } = require("../../config.json");

exports.run = (whats, msg, args, q, text, afterArgs) => {
    reply(`after args 0: ` + afterArgs)
};

exports.help = {
    name: "test",
    description: "test!",
    category: "Utility",
    usage: `${prefix}test`,
    cooldown: 5
};