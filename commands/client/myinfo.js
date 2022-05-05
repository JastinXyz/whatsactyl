const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async(whats, msg, args) => {
    try {
        const akey = await getUserApiKey(getNo(msg).replace(":12", ""))
     	const _c = new Nodeactyl.NodeactylClient(host, akey);
    	const res = await _c.getAccountDetails()
        const res2 = await _c.getAllServers()
        
        msg.key.remoteJid.endsWith('@g.us')? replyWithImgAndCap(`https://www.gravatar.com/avatar/${require("md5")(res.email)}?s=2048&d=mm&r=pg`, `*ID:* ${res.id}\n*Username:* ${res.username} (${res.email})\n*First Name/Last Name:* ${res.first_name}/${res.last_name}\n*Total Servers:* ${res2.meta.pagination.total}\n*API Key:* \`\`\`use this cmd in dm\`\`\`\n*Admin? ${res.admin}*`) : replyWithImgAndCap(`https://www.gravatar.com/avatar/${require("md5")(res.email)}?s=2048&d=mm&r=pg`, `*ID:* ${res.id}\n*Username:* ${res.username} (${res.email})\n*First Name/Last Name:* ${res.first_name}/${res.last_name}\n*Total Servers:* ${res2.meta.pagination.total}\n*API Key:* \`\`\`${akey}\`\`\`\n*Admin? ${res.admin}*`)
    } catch(err) {
        error(`try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`)
    }
};

exports.help = {
    name: "myinfo",
    description: "get your account details!",
    category: "Clinet",
    usage: `${prefix}myinfo`,
    cooldown: 5
};