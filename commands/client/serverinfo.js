const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async (whats, msg, args) => {
  if (!args[0]) {
    reply(`\`\`\`${prefix}serverinfo [server id]\`\`\``);
  } else {
    try {
      const _c = new Nodeactyl.NodeactylClient(
        host,
        await getUserApiKey(getNo(msg).replace(":14", ""))
      );
      const res = await _c.getServerDetails(args[0]);
      const res2 = await _c.getServerUsages(args[0]);

      let ips = [];
      res.relationships.allocations.data.forEach((element) => {
        const ip = element.attributes.ip + ":" + element.attributes.port;
        ips.push(ip);
      });

      let status;
      if (res2.current_state == "offline") {
        status = "🔴 Offline";
      } else if (res2.current_state == "starting") {
        status = "🟡 Starting";
      } else if (res2.current_state == "running") {
        status = "🟢 Running";
      } else {
        status = res2.current_state;
      }

      whats.sendMessage(
        msg.key.remoteJid,
        {
          text: `*〔 ${res.name} 〕*\n➥ Running on \`\`\`${ips.join(
            "` | `"
          )}\`\`\`\n\n*• ID:* ${res.identifier}\n*• Owner:* ${
            res.server_owner
          }\n*• Current State:* ${status}\n*• Database:* ${
            res.feature_limits.databases
          }\n*• Allocations:* ${res.feature_limits.allocations}\n*• Ram:* ${(
            res2.resources.memory_bytes /
            1024 /
            1024
          ).toFixed(2)} / ${res.limits.memory} MB\n*• Disk Usage:* ${(
            res2.resources.disk_bytes /
            1024 /
            1024
          ).toFixed(2)} / ${res.limits.disk} MB\n\n*➥ ${
            host + "/server/" + args[0]
          }*`,
        },
        { quoted: msg }
      );
    } catch (err) {
      error(
        `try whether your apikey client is valid or the server is not exists?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`
      );
    }
  }
};

exports.help = {
  name: "serverinfo",
  description: "get your server details!",
  category: "Client",
  usage: `${prefix}serverinfo [server id]`,
};
