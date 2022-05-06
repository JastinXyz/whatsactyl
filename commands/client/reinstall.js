const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async (whats, msg, args) => {
  if (!args[0]) {
    reply(`\`\`\`${prefix}reinstall [server id]\`\`\``);
  } else {
    try {
      const _c = new Nodeactyl.NodeactylClient(
        host,
        await getUserApiKey(getNo(msg).replace(":14", ""))
      );
      _c.reInstallServer(args[0])
        .then(() => {
          reply(`*✅ | Reinstall is in progress!*`);
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
  name: "reinstall",
  description: "reinstall server",
  category: "Client",
  usage: `${prefix}reinstall [server id]`,
};
