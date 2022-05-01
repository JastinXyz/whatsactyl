const { prefix } = require("../config.json");
const { readdir } = require("fs");

exports.run = (whats, msg, args) => {
    const tmpFile = {};
    readdir("./commands/", (e, files) => {
        if (e) return console.error(e);
        files.forEach(jsFile => {
            const cmdFile = require(`./${jsFile}`);
            tmpFile[jsFile.replace(".js", "")] = {};
            tmpFile[jsFile.replace(".js", "")].name = cmdFile.help.name;
            tmpFile[jsFile.replace(".js", "")].description = cmdFile.help.description;
            tmpFile[jsFile.replace(".js", "")].usage = cmdFile.help.usage;
        });
        
        if (!args[0]) {
            whats.sendMessage(msg.key.remoteJid, { text: `*Available commands:* ${Object.keys(tmpFile).join(", ")}\n\n_You can run *help <command name>* to show advanced help._` });
        } else {
            const commandName = args[0];
            const { name, description, usage } = require(`./${commandName}.js`).help;
            return whats.sendMessage(msg,key.remoteJid, { text: `*${name}*\n\nDescription: ${description}\nUsage: \`\`\`${usage}\`\`\`` });
        }
    });
};

exports.help = {
    name: "Help",
    description: "Show the bot's commands list",
    usage: `${prefix}help`,
    cooldown: 5
};