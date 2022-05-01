const { prefix } = require("../../config.json");
/*const jsonfile = require('jsonfile');
const fs = require('fs');*/
const userDb = require('../../database/user-data.json');

exports.run = async(whats, msg, args) => {
    if(!args[0]) {
        whats.sendMessage(msg.key.remoteJid, { text: `${prefix}setApiKey [client | application] [api key]` })
    } else if(args[0] == 'client') {
        if(!args[1]) whats.sendMessage(msg.key.remoteJid, { text: `${prefix}setApiKey client [api key]` })
        
        await msg.key.remoteJid['key'] = args[0];
    	whats.sendMessage(msg.key.remoteJid, { text: `Updated!` });
        whats.sendMessage(msg.key.remoteJid, { text: userDb })
    } else if(args[0] == 'application') {
        whats.sendMessage(msg.key.remoteJid, { text: `soon!` })
    }
};

exports.help = {
    name: "Set User API  Key",
    description: "update the user api key!",
    category: "Utility",
    usage: `${prefix}setApiKey [client | application] [api key]`,
    cooldown: 5
};