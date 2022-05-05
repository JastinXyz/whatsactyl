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

const buttonMessage = {
    text: `*〔 SERVER CONTROL 〕*\n• Current State: ${status}\n`,
    footer: '© Beta',
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