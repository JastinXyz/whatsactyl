let cp = require("child_process");
let { promisify } = require("util");
let exec = promisify(cp.exec).bind(cp);
const { prefix } = require("../../config.json");

exports.run = async (whats, msg, args, q) => {
    if(!isOwner) return reply("❌ | Only owner can use eval command!")
  if(!q) return reply("wheres the code?")
  let o;
  try {
    o = await exec(q);
  } catch (e) {
    o = e;
  } finally {
    let { stdout, stderr } = o;
    if (stdout) reply(stdout);
    if (stderr) reply(stderr);
  }
};

exports.help = {
  name: "exec",
  description: "Execute Code.",
  category: "Owner",
  usage: `${prefix}exec`,
  cooldown: 5,
};
