const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async (whats, msg, args) => {
  if (!args[0]) {
    reply(`\`\`\`${prefix}backup [create | delete | list] [server id]\`\`\``);
  } else {
    try {
      const _c = new Nodeactyl.NodeactylClient(
        host,
        await getUserApiKey(getNo(msg).replace(":14", ""))
      );
      if (args[0] == "create") {
        if (!args[1]) {
          reply(`\`\`\`${prefix}backup create [server id]\`\`\``);
        } else {
          _c.createServerBackup(args[1])
            .then(async (x) => {
              const urlbackup = await _c.getBackupDownload(args[1], x.uuid);

              msg.key.remoteJid.endsWith("@g.us")
                ? whats
                    .sendMessage(
                      getNo(msg).replace(":14", ""),
                      { text: `*➥ Download: ${urlbackup.url}*` },
                      { quoted: msg }
                    )
                    .then(
                      reply(`*✅ | Created!*\n\n*➥ Download: sended in dm.*`)
                    )
                : reply(`*✅ | Created!*\n\n*➥ Download: ${urlbackup.ur}*`);
            })
            .catch((e) => {
              error(`is the server id valid?\n\n*ERROR LOGS:*\n${e}`);
            });
        }
      } else if (args[0] == "delete") {
        if (!args[1]) {
          reply(`\`\`\`${prefix}backup delete [server id] [backup uuid]\`\`\``);
        } else if (!args[2]) {
          reply(`\`\`\`${prefix}backup delete ${args[1]} [backup uuid]\`\`\``);
        } else {
          _c.deleteBackup(args[1], args[2])
            .then(() => {
              reply(`*✅ | Deleted!*`);
            })
            .catch((e) => {
              error(`is the server id valid?\n\n*ERROR LOGS:*\n${e}`);
            });
        }
      } else if (args[0] == "list") {
        if (msg.key.remoteJid.endsWith("@g.us")) {
          reply(`❌ | This command is dm-only`);
        } else if (!args[1]) {
          reply(`\`\`\`${prefix}backup list [server id]\`\`\``);
        } else {
          _c.listServerBackups(args[1])
            .then(async (x) => {
              const n = await _c.getServerDetails(args[1]);
              let num = 0;
              let teks = `*〔 ${n.name} Backup List 〕*\n\n`;
              for (let i of x) {
                let y = i.attributes;
                num += 1;
                teks += `${num}. ${y.name}\n• UUID: ${y.uuid}\n• Created At: ${y.created_at}\n\n`;
              }

              reply(teks);
            })
            .catch((e) => {
              error(`is the server id valid?\n\n*ERROR LOGS:*\n${e}`);
            });
        }
      }
    } catch (err) {
      error(
        `try whether your apikey client is valid or server is exists?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`
      );
    }
  }
};

exports.help = {
  name: "backup",
  description: "create backup? delete backup? or just see list of backup?",
  category: "Client",
  usage: `${prefix}backup [create | delete | list] [server id]`,
};
