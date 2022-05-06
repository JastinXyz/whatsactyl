const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async (whats, msg, args, q, text, afterArgs) => {
  try {
    const akey = await getUserApiKey(getNo(msg).replace(":14", ""));
    const _c = new Nodeactyl.NodeactylClient(host, akey);
    if (!args[0]) {
      reply(`\`\`\`${prefix}renameserver [server id] [new name]\`\`\``);
    } else if (!args[1]) {
      reply(`\`\`\`${prefix}renameserver ${args[0]} [new name]\`\`\``);
    } else {
      const ress = await _c.renameServer(args[0], afterArgs);

      const templateButtons = [
        {
          index: 1,
          urlButton: {
            displayText: "View your server",
            url: host + "/server/" + args[0],
          },
        },
      ];

      const templateMessage = {
        text: `✅ | ${msg.pushName}, Successfully renamed to *_${afterArgs}_*`,
        footer: host,
        templateButtons: templateButtons,
      };

      whats.sendMessage(from, {
        text: templateMessage.text,
        footer: templateMessage.footer,
        templateButtons,
      });
    }
  } catch (err) {
    error(
      `try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`
    );
  }
};

exports.help = {
  name: "renameserver",
  description: "rename server!",
  category: "Client",
  usage: `${prefix}renameserver [server id] [new name]`,
};
