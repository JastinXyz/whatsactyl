const { prefix, host } = require("../../config.json");
const { application } = require("../../models/nodeactyl.js");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");

exports.run = async (whats, msg, args) => {
  const akey = await getUserApiKey(getNo(msg).replace(":14", ""));
  if ((await isAdmin(akey)) == false) {
    reply(`❌ | This command is panel admin-only!`);
  } else {
    application
      .getAllServers()
      .then((x) => {
        let num = 0;
        let teks = `*〔 All Servers 〕*\n\n`;
        for (let i of x.data) {
          let y = i.attributes;
          num += 1;
          teks += `*${num}. ${y.name}*\n• ID: ${y.id}\n• Identifier: ${y.identifier}\n• UUID: ${y.uuid}\n• RAM: ${y.limits.memory}\n• Database: ${y.feature_limits.databases}\n• Allocations: ${y.feature_limits.allocations}\n• Node: ${y.node}\n\n`;
        }

        reply(teks);
      })
      .catch((e) => {
        error(`*ERROR LOGS:*\n${e}`);
      });
  }
};

exports.help = {
  name: "allservers",
  description: "get all servers...",
  category: "Application",
  usage: `${prefix}allservers`,
};
