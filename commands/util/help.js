const { prefix } = require("../../config.json");
const fs = require("fs");
const path = require('path')

exports.run = async(whats, msg, args) => {
    var tmpFile = {};
    const commandFolders = fs.readdirSync('./commands');
    //kontol
    function walk(dir, callback) {
    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            var filepath = path.join(dir, file);
            fs.stat(filepath, function(err,stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile() && file.endsWith('.js')) {
                    tmpFile[file.replace(".js", "")] = {}
                    return tmpFile
                }
            });
        });
    });
}
        
    if (!args[0]) {
            //whats.sendMessage(msg.key.remoteJid, { text: `*Available commands:* ${Object.keys(tmpFile).join(", ")}\n\n_You can run *help <command name>* to show advanced help._` });
        /*const a = await walk('./commands')
        console.log(a)
        reply(JSON.stringify(a))*/
        reply('Shut up')
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
    
    
    
    /*fs.readdir("./commands/util", (e, files) => {
        if (e) return console.error(e);
        files.forEach(jsFile => {
            const cmdFile = require(`./${jsFile}`);
            tmpFile[jsFile.replace(".js", "")] = {};
            tmpFile[jsFile.replace(".js", "")].name = cmdFile.help.name;
            tmpFile[jsFile.replace(".js", "")].description = cmdFile.help.description;
            tmpFile[jsFile.replace(".js", "")].usage = cmdFile.help.usage;
        });
        
   // logic here
      })*/

/*for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    fs.readdir(`./commands/${folder}`, (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
     	//const cmdFile = require(`../../commands/util/${commandFile}`);
            tmpFile[commandFile.replace(".js", "")] = {};
            //tmpFile[commandFile.replace(".js", "")].name = cmdFile.help.name;
            //tmpFile[commandFile.replace(".js", "")].description = cmdFile.help.description;
            //tmpFile[commandFile.replace(".js", "")].usage = cmdFile.help.usage;
    });
  });
}*/
};

exports.help = {
    name: "Help",
    description: "Show the bot's commands list",
    category: "Utility",
    usage: `${prefix}help`,
    cooldown: 5
};