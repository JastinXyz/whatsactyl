const util = require("util");
const { prefix } = require("../../config.json");

exports.run = async (whats, msg, args, q) => {
  try {
    if(!isOwner) return reply("❌ | Only owner can use eval command!") 
    if(!q) return reply("code required")
    let evaled = await eval(q);
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    await whats.sendMessage(msg.key.remoteJid, { text: evaled });
  } catch (err) {
    m = String(err);
    await whats.sendMessage(msg.key.remoteJid, { text: util.format(m) });
  }
};

exports.help = {
  name: "eval",
  description: "Eval Code Javascript.",
  category: "Owner",
  usage: `${prefix}eval`,
  cooldown: 5,
};
