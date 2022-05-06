const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async (whats, msg, args, q, text, afterArgs) => {
  if (!args[0]) {
    reply(`\`\`\`${prefix}sendcommand [server id] [command]\`\`\``);
  } else if (!args[1]) {
    reply(`\`\`\`${prefix}sendcommand ${args[0]} [command]\`\`\``);
  } else {
    try {
      const _c = new Nodeactyl.NodeactylClient(
        host,
        await getUserApiKey(getNo(msg).replace(":14", ""))
      );
      _c.sendServerCommand(args[0], afterArgs)
        .then(() => {
          reply(`*✅ | Command sent!*`);
        })
        .catch((e) => {
          error(`is the server id valid?\n\n*ERROR LOGS:*\n${e}`);
        });
    } catch (err) {
      error(
        `try whether your apikey client is valid or server is exists?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`
      );
    }
  }
};

exports.help = {
  name: "sendcommand",
  description: "send server commands",
  category: "Client",
  usage: `${prefix}sendcommand [server id] [command]`,
};
