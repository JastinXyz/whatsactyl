const { prefix, host } = require("../../config.json");
const { application } = require("../../models/nodeactyl.js");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");

exports.run = async (whats, msg, args) => {
  try {
    const akey = await getUserApiKey(getNo(msg).replace(":14", ""));
    if ((await isAdmin(akey)) == false) {
      reply(`❌ | This command is panel admin-only!`);
    } else {
      if (!args[0]) {
        reply(`\`\`\`${prefix}getuserdetails [user id]\`\`\``);
      } else {
        const y = await application.getUserDetails(args[0]);
        const templateButtons = [
          {
            index: 1,
            urlButton: {
              displayText: "[ admin ] view",
              url: host + "/admin/users/view/" + y.attributes.id,
            },
          },
          {
            index: 2,
            urlButton: {
              displayText: "[ admin ] server owned",
              url:
                host + "/admin/servers?filter%5Bowner_id%5D=" + y.attributes.id,
            },
          },
        ];

        const templateMessage = {
          text: `*🪪 ID/External ID:* ${y.attributes.id}/${y.attributes.external_id}\n*😏 Username:* ${y.attributes.username}\n*📧 Email:* ${y.attributes.email}\n*🗣️ First name/Last Name:* ${y.attributes.first_name}/${y.attributes.last_name}\n*🇺🇸 Language:* ${y.attributes.language}\n*🎟️ Is Admin? ${y.attributes.root_admin}*\n*🦺 Is 2FA enabled? ${y.attributes["2fa"]}*\n*📆 Created At:* ${y.attributes.created_at}\n*🆙 Updated At:* ${y.attributes.updated_at}\n*🗂️ UUID:* ${y.attributes.uuid}`,
          footer: host,
          templateButtons: templateButtons,
        };

        whats.sendMessage(
          from,
          {
            image: {
              url: `https://www.gravatar.com/avatar/${require("md5")(
                y.attributes.email
              )}?s=2048&d=mm&r=pg`,
            },
            caption: templateMessage.text,
            footer: templateMessage.footer,
            templateButtons,
          },
          { quoted: msg }
        );
      }
    }
  } catch (e) {
    reply("ERR: " + e);
  }
};

exports.help = {
  name: "getuserdetails",
  description: "Gets details of a user",
  category: "Application",
  usage: `${prefix}getuserdetails [user id]`,
};
