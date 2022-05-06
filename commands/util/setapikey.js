const conf = require("../../config.json");
/*const jsonfile = require('jsonfile');
const fs = require('fs');*/
const { User } = require('../../models/db.js')
const { getUserApiKey, isAdmin, getNo } = require('../../models/func.js')

exports.run = async(whats, msg, args) => {
    if(msg.key.remoteJid.endsWith('@g.us')) {
        reply(`❌ | This command is dm-only`)
    } else if(!args[0]) {
        reply(`\`\`\`${conf.prefix}setapikey [client | application] [api key]\`\`\``);
    } else if(args[0] == 'client') {
        if(!args[1]) {
            reply(`\`\`\`${conf.prefix}setapikey client [api key]\`\`\``);
        } else {
         	User.findOne({ no: msg.key.remoteJid }, async function (err, obj) {
  			var hitt = obj;
  				if (obj == undefined) {
   					 const aa = new User({ pushname: msg.pushName, no: msg.key.remoteJid, api_key: args[1] });
   					 aa.save().then(() => {
    					  reply(`Updated!`)
   					 })
  				} else {
   					 /*User.find({ no: getNo() }, async function (err, obj) {
      				var hitt = obj[0];
       					 User.findOneAndUpdate(
       					   { no: getNo() },
        				   { api_key: args[1] },
         			 function (err, call) {
           				 reply(`Updated!`)
         			 }
        			);
   				 });*/
                    User.findOneAndUpdate({ no: msg.key.remoteJid }, { api_key: args[1] },
         			 function (err, call) {
           				 reply('*✅ | Updated!*')
         			 }
        			);
 				 }
			});
        }
    } else if(args[0] == 'application') {
        const akey = await getUserApiKey(getNo(msg).replace(":12", ""))
    if ((await isAdmin(akey)) == false) {
      reply(`❌ | This command is panel admin-only!`);
    } else if(!args[1]) {
            reply(`\`\`\`${conf.prefix}setapikey application [api key]\`\`\``)
        } else {
            const editJsonFile = require("edit-json-file");
			const file = editJsonFile(`./config.json`, {
    			autosave: true
			});

			file.set("application.api_key", args[1])
            reply('*✅ | Updated!*')
        }
    }
};

exports.help = {
    name: "Set User API  Key",
    description: "update the user api key!",
    category: "Utility",
    usage: `${conf.prefix}setApiKey [client | application] [api key]`,
    cooldown: 5
};