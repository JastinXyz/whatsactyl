const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async(whats, msg, args) => {
    if(msg.key.remoteJid.endsWith('@g.us')) return reply(`❌ | This command is dm-only`)
    if(!args[0]) {
        reply(`\`\`\`${prefix}manage [server id]\`\`\``)
    } else {
        try {
     	const _c = new Nodeactyl.NodeactylClient(host, await getUserApiKey(getNo(msg).replace(":12", "")));
        const state = await _c.getServerUsages(args[0])
        const res = await _c.getServerDetails(args[0])
        let ips = [];
               res.relationships.allocations.data.forEach(element => {
        	const ip = element.attributes.ip + ':' + element.attributes.port;
            ips.push(ip);
        });
        let buttons;
        let status;      
        if(state.current_state == "offline") {
            buttons = [
  {buttonId: `${prefix}start ${args[0]}`, buttonText: {displayText: 'Start'}, type: 1},
  {buttonId: `${prefix}restart ${args[0]}`, buttonText: {displayText: 'Restart'}, type: 1},
  {buttonId: `${prefix}kill ${args[0]}`, buttonText: {displayText: 'Kill'}, type: 1}
]
        } else if(state.current_state == "running" || state.current_state == "starting") {
            buttons = [
  {buttonId: `${prefix}restart ${args[0]}`, buttonText: {displayText: 'Restart'}, type: 1},
  {buttonId: `${prefix}stop ${args[0]}`, buttonText: {displayText: 'Stop'}, type: 1},
  {buttonId: `${prefix}kill ${args[0]}`, buttonText: {displayText: 'Kill'}, type: 1}
]
        } else {
             buttons = [
  {buttonId: `${prefix}start ${args[0]}`, buttonText: {displayText: 'Start'}, type: 1},
  {buttonId: `${prefix}restart ${args[0]}`, buttonText: {displayText: 'Restart'}, type: 1},
  {buttonId: `${prefix}kill ${args[0]}`, buttonText: {displayText: 'Kill'}, type: 1}
]
        }
        
        if(state.current_state == "offline") {
            status = '🔴 Offline'
        } else if(state.current_state == "starting") {
            status = '🟡 Starting'
        } else if(state.current_state == "running") {
            status = '🟢 Running'
        } else {
            status = res2.current_state
        }

const t = `*〔 SERVER CONTROL 〕*\n➥ Running on \`\`\`${ips.join('` | `')}\`\`\`\n\n*• ID:* ${res.identifier}\n*• Server Name:* ${res.name}\n*• Current State:* ${status}\n*• Database:* ${res.feature_limits.databases}\n*• Allocations:* ${res.feature_limits.allocations}\n*• Ram:* ${(state.resources.memory_bytes / 1024 / 1024).toFixed(2)} / ${res.limits.memory} MB\n*• Disk Usage:* ${(state.resources.disk_bytes / 1024 / 1024).toFixed(2)} / ${res.limits.disk} MB\n\n*➥ ${host + '/server/' + args[0]}*`           
            
const buttonMessage = {
    text: t, 
    footer: '© Whatsactyl Bot',
    buttons: buttons,
    headerType: 1
}

whats.sendMessage(msg.key.remoteJid, buttonMessage, {quoted: msg})
    } catch(err) {
      
        error(`try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`)
    	}
    }
};

exports.help = {
    name: "myinfo",
    description: "get your account details!",
    category: "Clinet",
    usage: `${prefix}myinfo`,
    cooldown: 5
};