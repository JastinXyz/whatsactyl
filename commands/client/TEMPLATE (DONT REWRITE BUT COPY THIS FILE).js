const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async(whats, msg, args) => {
    try {
     	const _c = new Nodeactyl.NodeactylClient(host, await getUserApiKey(getNo(msg).replace(":12", "")));
    	// do something here (Hapus comment ini)
    } catch(err) {
        // change the error jika tau apa yg error tpi idk (Hapus comment ini)
        error(`try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`)
    }
};

exports.help = {
    name: "myinfo",
    description: "get your account details!",
    category: "Clinet",
    usage: `${prefix}myinfo`,
    cooldown: 5
};