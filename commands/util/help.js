const { prefix } = require("../../config.json");
const fs = require("fs");
const path = require('path')

exports.run = async(whats, msg, args) => {
    var tmpFile = {};
   const commandFolders = fs.readdirSync('./commands');

/*for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    fs.readdir(`./commands/${folder}`, (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
      tmpFile[commandFile.replace(".js", "")] = {}
    });
   
  });
  
}*/
    
    if (!args[0]) {
           // whats.sendMessage(msg.key.remoteJid, { text: `*Available Commands:* ${Object.keys(commandFolders).join(", ")}\n\n_You can run *help <command name>* to show advanced help._` });
        reply(`Hello ${msg.pushName} 👋\n\n*CLIENT*\nbackup, kill, manage, myinfo, reinstall, renameserver, restart, sendcommand, serverinfo, servers, start, stop, update\n\n*APPLICATION*\nallservers, allusers, getuserdetails, server\n\n*UTILITY*\nhelp, ping, setapikey\n\n*OWNER*\neval, exec\n\n_You can run *!help <command name>* to show advanced help._`)
        /*const a = await walk('./commands')
        console.log(a)
        reply(JSON.stringify(a))*/
        //reply('Shut up')
        } else {
            const commandName = args[0];
           // const { name, description, category, usage } = require(`./${commandName}.js`).help;
            let h;
            if(fs.existsSync(`./commands/util/${commandName}.js`)) {
           h = require(`./${commandName}.js`).help;
        } else if(fs.existsSync(`./commands/application/${commandName}.js`)) {
            h = require(`../application/${commandName}.js`).help
        } else if(fs.existsSync(`./commands/client/${commandName}.js`)) {
            h = require(`../client/${commandName}.js`).help
        } else if(fs.existsSync(`./commands/owner/${commandName}.js`)) {
            h = require(`../owner/${commandName}.js`).help
        }
            
            if(!h) {
                reply(`❌ | Command not found!`)
            } else {
               	reply(`*${h.name}*\n\nDescription: ${h.description}\nCategory: ${h.category}\nUsage: \`\`\`${h.usage}\`\`\``)
            }
        }
};

exports.help = {
    name: "Help",
    description: "Show the bot's commands list",
    category: "Utility",
    usage: `${prefix}help`,
    cooldown: 5
};