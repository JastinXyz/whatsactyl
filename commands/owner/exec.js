let cp = require("child_process");
let { promisify } = require("util");
let exec = promisify(cp.exec).bind(cp);
const { prefix } = require("../../config.json");

exports.run = async (whats, msg, args, q) => {
  if(!q) return reply("Mana Code Yang Mau Di Execute?")
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
