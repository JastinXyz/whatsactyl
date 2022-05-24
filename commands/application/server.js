const cfg = require("../../config.json");
const axios = require("axios");
let prefix = cfg.prefix;
const { application, Nodeactyl } = require("../../models/nodeactyl.js");
const {
  getUserApiKey,
  isAdmin,
  getNo,
  decodeJid,
  eggDetails,
} = require("../../models/func.js");

exports.run = async (whats, msg, args) => {
  try {
    const akey = await getUserApiKey(decodeJid(getNo(msg)));
    if ((await isAdmin(akey)) == false) {
      reply(`❌ | This command is panel admin-only!`);
    } else {
      if (!args[0]) {
        reply(`\`\`\`${prefix}server [suspend | unsuspend | create | delete]\`\`\``);
      } else {
        if (args[0] == "suspend") {
          if (!args[1]) {
            reply(`\`\`\`${prefix}server suspend [server id]\`\`\``);
          } else {
            application
              .suspendServer(args[1])
              .then((x) => {
                reply(`\`\`\`*✅ | Server suspended!*\`\`\``);
              })
              .catch((err) => {
                error(`ERROR:\n${err}`);
              });
          }
        } else if (args[0] == "unsuspend") {
          if (!args[1]) {
            reply(`\`\`\`${prefix}server unsuspend [server id]\`\`\``);
          } else {
            application
              .unsuspendServer(args[1])
              .then((x) => {
                reply(`\`\`\`*✅ | Server unSuspended!*\`\`\``);
              })
              .catch((err) => {
                error(`ERROR:\n${err}`);
              });
          }
        } else if (args[0] == "create") {
          if (!args[1]) {
            reply(
              `\`\`\`${prefix}server create [owner id] [name] [egg id] [ram (mb) (optional)] [disk (mb) (optional)] [cpu (mb) (optional)]\`\`\``
            );
          } else if (!args[2]) {
            reply(
              `\`\`\`${prefix}server create ${args[1]} [name] [egg id] [ram (mb) (optional)] [disk (mb) (optional)] [cpu (mb) (optional)]\`\`\``
            );
          } else if (!args[3]) {
            reply(
              `\`\`\`${prefix}server create ${args[1]} ${args[2]} [egg id] [ram (mb) (optional)] [disk (mb) (optional)] [cpu (mb) (optional)]\`\`\``
            );
          } else {
            const egg = await eggDetails(cfg.serverCreate.nestId, args[3]);
            const findIndex = cfg.serverCreate.egg.findIndex(
              (x) => x.eggId === args[3]
            );
            //if (!findIndex) reply(`Egg Id not found!`);

            let A = {
              name: args[2],
              user: Number(args[1]),
              egg: Number(args[3]),
              docker_image: egg.attributes.docker_image,
              startup: egg.attributes.startup,
              environment: cfg.serverCreate.egg[findIndex].environment,
              limits: {
                memory: Number(args[4]? args[4] : cfg.serverCreate.ram),
                swap: 0,
                disk: Number(args[5]? args[5] : cfg.serverCreate.disk),
                io: 500,
                cpu: Number(args[6]? args[6] : cfg.serverCreate.cpu),
              },
              feature_limits: {
                databases: Number(cfg.serverCreate.limits.db),
                backups: Number(cfg.serverCreate.limits.backups),
                allocations: Number(cfg.serverCreate.limits.allocations),
              },
              allocation: {
                default: 1,
              },
            };

            require("node-fetch")(`${cfg.host}/api/application/servers`, {
              method: "POST",
              followRedirect: true,
              maxRedirects: 5,
              headers: {
                Authorization: "Bearer " + cfg.application.api_key,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
              },
              body: JSON.stringify(A),
            })
              .then((d) => d.json())
              .then((x) => {
                  reply(
                    `✅ | Server created with *IDENTIFIER: ${x.attributes.identifier}*`
                  );
              })
              .catch((err) => {
                error(`ERROR:\n${err}`);
              });
          }
        } else if (args[0] == "delete") {
          if (!args[1]) {
            reply(`\`\`\`${prefix}server delete [server id]\`\`\``);
          } else {
            application
              .deleteServer(args[1])
              .then((x) => {
                reply(`\`\`\`*✅ | Server deleted!*\`\`\``);
              })
              .catch((err) => {
                error(`ERROR:\n${err}`);
              });
          }
        } else {
          reply(`\`\`\`${prefix}server [suspend | unsuspend | create | delete]\`\`\``);
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
  usage: `${prefix}server [suspend | unsuspend | create | delete]`,
};

