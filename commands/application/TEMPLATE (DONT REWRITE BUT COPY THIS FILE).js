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
        reply(`\`\`\`${prefix}getuserdetails [user id]\`\`\``);
      } else {
        // do something here
      }
    }
  } catch (e) {
    error('ERROR:\n' + e)
  }
};

exports.help = {
  name: "name",
  description: "desc",
  category: "Application",
  usage: `${prefix}name [args]`,
  cooldown: 5,
};
