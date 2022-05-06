const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");
const _s = require("scramb");
const axios = require("axios");

exports.run = async (whats, msg, args) => {
  const _c = new Nodeactyl.NodeactylClient(
    host,
    await getUserApiKey(getNo(msg).replace(":14", ""))
  );
  if (msg.key.remoteJid.endsWith("@g.us")) {
    reply(`❌ | This command is dm-only!`);
  } else if (!args[0]) {
    reply(
      `\`\`\`${prefix}update [ email | password ] [ new opts ] [ current password ]\`\`\``
    );
  } else if (args[0] == "email") {
    if (!args[1]) {
      reply(
        `\`\`\`${prefix}update email [ new email ] [ current password ]\`\`\``
      );
    }
    if (_s.isEmail(args[1]).result == false) {
      reply(`\`\`\`❌ | ${args[1]} Doesn't seem like a valid email...\`\`\``);
    } else if (!args[2]) {
      reply(
        `\`\`\`${prefix}update email ${args[1]} [ current password ]\`\`\``
      );
    } else {
      try {
        const a = await _c.updateEmail(args[1], args.slice(2).join(" "));
        whats.sendMessage(msg.key.remoteJid, {
          text:
            "*✅ | @" +
            getNo(msg).replace(":12", "").replace("@s.whatsapp.net", "") +
            `, The email should have been changed to ${args[1]} if your password is not wrong!*`,
          mentions: [getNo(msg).replace(":12", "")],
        });
      } catch (err) {
        error(
          `try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`
        );
      }
    }
  } else if (args[0] == "password") {
    if (!args[1]) {
      reply(
        `\`\`\`${prefix}update password [ new password ] [ current password ]\`\`\``
      );
    } else if (args[1].length <= 8) {
      reply(`\`\`\`❌ | New password must be >8 length...\`\`\``);
    } else if (!args[2]) {
      reply(
        `\`\`\`${prefix}update password ${args[1]} [ current password ]\`\`\``
      );
    } else {
      try {
        const y = await axios({
          url: `${host}/api/client/account/password`,
          method: "PUT",
          followRedirect: true,
          maxRedirects: 5,
          headers: {
            Authorization:
              "Bearer " + (await getUserApiKey(getNo(msg).replace(":12", ""))),
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
          },
          data: {
            current_password: args.slice(2).join(" "),
            password: args[1],
            password_confirmation: args[1],
          },
        });
        whats.sendMessage(msg.key.remoteJid, {
          text:
            "*✅ | @" +
            getNo(msg).replace(":12", "").replace("@s.whatsapp.net", "") +
            `, The password should have been changed if your current password is not wrong!*`,
          mentions: [getNo(msg).replace(":12", "")],
        });
      } catch (e) {
        error("ERROR:\n" + e);
      }
    }
  } else {
    reply(`\`\`\`${prefix}update [ email | password ] [ message ]\`\`\``);
  }
};

exports.help = {
  name: "update",
  description: "update your email or password.",
  category: "Client",
  usage: `${prefix}update [ email | password ]`,
};
