const { prefix } = require("../../config.json");
/*const jsonfile = require('jsonfile');
const fs = require('fs');*/
const { User } = require('../../models/db.js')
const { getNo } = require('../../models/func.js')

exports.run = (whats, msg, args) => {
    if(msg.key.remoteJid.endsWith('@g.us')) {
        reply(`❌ | This command is dm-only`)
    } else if(!args[0]) {
        reply(`\`\`\`${prefix}setapikey [client | application] [api key]\`\`\``);
    } else if(args[0] == 'client') {
        if(!args[1]) {
            reply(`\`\`\`${prefix}setapikey client [api key]\`\`\``);
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
           				 reply(`Updated!`)
         			 }
        			);
 				 }
			});
        }
    } else if(args[0] == 'application') {
        reply(`soon!`)
    }
};

exports.help = {
    name: "Set User API  Key",
    description: "update the user api key!",
    category: "Utility",
    usage: `${prefix}setApiKey [client | application] [api key]`,
    cooldown: 5
};