const { prefix, host } = require("../../config.json");
const { application } = require("../../models/nodeactyl.js");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");

exports.run = async (whats, msg, args) => {
    const akey = await getUserApiKey(getNo(msg).replace(":12", ""))
    if ((await isAdmin(akey)) == false) {
      reply(`❌ | This command is admin-only!`);
    } else {
      application.getAllUsers(args[0] || 1).then((x) => {
let num = 0
let teks = `*〔 All Users 〕*\n\n`
for (let i of x.data) {
let y = i.attributes
num += 1
teks += `*${num}. ${y.username}*\n• Identifier: ${y.id}\n• UUID: ${y.uuid}\n• Email: ${y.email}\n• First Name/Last Name: ${y.first_name}/${y.last_name}\n• Created At: ${y.created_at}\n• ${host}/admin/users/view/${y.id}\n\n`
}

reply(teks)
                }).catch((e) => {
                		error(`*ERROR LOGS:*\n${e}`)
            		})
    }
};

exports.help = {
  name: "allusers",
  description: "get all users...",
  category: "Application",
  usage: `${prefix}allusers [page (optional)]`,
  cooldown: 5,
};
