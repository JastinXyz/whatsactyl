const { prefix, host } = require("../../config.json");
const { getUserApiKey, isAdmin, getNo } = require("../../models/func.js");
const Nodeactyl = require("nodeactyl");

exports.run = async(whats, msg, args) => {
    try {
     	const _c = new Nodeactyl.NodeactylClient(host, await getUserApiKey(getNo(msg).replace(":12", "")));
    	_c.getAllServers().then((x) => {
                      
             //const n = await _c.getServerDetails(args[1])
let num = 0
let teks = `*〔 ${x.meta.pagination.total} Servers Owned 〕*\n\n`
for (let i of x.data) {
let y = i.attributes
num += 1
teks += `${num}. ${y.name}\n• Identifier: ${y.identifier}\n• UUID: ${y.uuid}\n• RAM: ${y.limits.memory}\n• Database: ${y.feature_limits.databases}\n• Allocations: ${y.feature_limits.allocations}\n• Node: ${y.node}\n\n`
}

reply(teks)
                }).catch((e) => {
                		error(`is the server id valid?\n\n*ERROR LOGS:*\n${e}`)
            		})
        
    } catch(err) {
        error(`try whether your apikey client is valid?. Or ask the developer about this problem...\n\n*ERROR LOGS:*\n${err}`)
    }
};

exports.help = {
    name: "servers",
    description: "get all servers in your account!",
    category: "Clinet",
    usage: `${prefix}servers`,
    cooldown: 5
};