const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async(whats, msg, args) => {
    try {
if(msg.key.remoteJid.endsWith('@g.us')) return reply(`❌ | This command is dm-only`)
     	const _c = new Nodeactyl.NodeactylClient(host, await getUserApiKey(getNo(msg).replace(":12", "")));
    	  if(!args[0]) return reply(`\`\`\`${prefix}stop [server id]\`\`\``)
          _c.stopServer(args[0]).then((x) => {
    	   reply(`*✅ | Stop Server*`)
         }).catch((e) => {
         error(`is the server id valid?\n\n*ERROR LOGS:*\n${e}`)
        })
     } catch(err) {
        error(`try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`)
    }
};

exports.help = {
    name: "stop",
    description: "Stop a Server",
    category: "Clinet",
    usage: `${prefix}stop`,
    cooldown: 5
};