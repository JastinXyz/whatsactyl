const cfg = require("../../config.json");
let prefix = cfg.prefix;
const { application } = require("../../models/nodeactyl.js");
const { getUserApiKey, isAdmin, getNo, decodeJid } = require("../../models/func.js");

exports.run = async (whats, msg, args) => {
  try {
    const akey = await getUserApiKey(decodeJid(getNo(msg)));
    if ((await isAdmin(akey)) == false) {
      reply(`❌ | This command is panel admin-only!`);
    } else {
      if (!args[0]) {
        reply(`\`\`\`${prefix}user [create | delete]\`\`\``);
      } else {
         if (args[0] == "create") {
          if (!args[1]) {
            reply(`\`\`\`${prefix}user create [email] [username]\`\`\``);
          } else if (!args[2]) {
            reply(`\`\`\`${prefix}user create ${args[1]} [username]\`\`\``);
          } else {
            application.createUser(
              args[1],
              args[2],
              args[2],
              args[2]
            ).then((x) => {
              reply(`✅ | User created with *ID: ${x.attributes.id}*\n*${x.meta.resource}*`)
            }).catch((err) => {
              error(`ERROR:\n${err}`)
            });
          }
        } else if (args[0] == "delete") {
          if (!args[1]) {
            reply(`\`\`\`${prefix}user delete [user id]\`\`\``);
          } else {
            application
              .deleteUser(args[1])
              .then((x) => {
                reply(`\`\`\`✅ | User deleted!\`\`\``);
              })
              .catch((err) => {
                error(`ERROR:\n${err}`);
              });
          }
        } else {
          reply(`\`\`\`${prefix}user [create | delete]\`\`\``);
        }
      }
    }
  } catch (e) {
    error("ERROR:\n" + e);
  }
};

exports.help = {
  name: "server",
  description: "managing server for admin.",
  category: "Application",
  usage: `${prefix}server [suspend | unsuspend]`,
};
