const { prefix, host } = require("../../config.json");
const { application } = require("../../models/nodeactyl.js");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");

exports.run = async (whats, msg, args) => {
  try {
    const akey = await getUserApiKey(getNo(msg).replace(":12", ""))
    if ((await isAdmin(akey)) == false) {
      reply(`❌ | This command is admin-only!`);
    } else {
      if (!args[0]) {
        reply(`\`\`\`${prefix}server [suspend | unsuspend]\`\`\``);
      } else {
        if(args[0] == "suspend") {
            if(!args[1]) {
        		reply(`\`\`\`${prefix}server suspend [server id]\`\`\``);
            } else {
                application.suspendServer(args[1]).then((x) => {
                    reply(`\`\`\`*✅ | Server suspended!*\`\`\``)
                }).catch(err => {
                    error(`ERROR:\n${err}`)
                })
            }
        } else if(args[0] == "unsuspend") {
            if(!args[1]) {
        		reply(`\`\`\`${prefix}server unsuspend [server id]\`\`\``);
            } else {
                application.unsuspendServer(args[1]).then((x) => {
                    reply(`\`\`\`*✅ | Server unSuspended!*\`\`\``)
                }).catch(err => {
                    error(`ERROR:\n${err}`)
                })
            }
        } else {
            reply(`\`\`\`${prefix}server [suspend | unsuspend]\`\`\``);
        }
      }
    }
  } catch (e) {
    error('ERROR:\n' + e)
  }
};

exports.help = {
  name: "server",
  description: "managing server for admin.",
  category: "Application",
  usage: `${prefix}server [suspend | unsuspend]`,
  cooldown: 5,
};
