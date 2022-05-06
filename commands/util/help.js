const { prefix, host } = require("../../config.json");
const fs = require("fs");
const path = require("path");

exports.run = async (whats, msg, args) => {
  var tmpFile = {};
  const commandFolders = fs.readdirSync("./commands");

  if (!args[0]) {
    const t = `Hello ${msg.pushName} 👋\n\n*CLIENT*\nbackup, kill, manage, myinfo, reinstall, renameserver, restart, sendcommand, serverinfo, servers, start, stop, update\n\n*APPLICATION*\nallservers, allusers, getuserdetails, server\n\n*UTILITY*\nhelp, ping, setapikey\n\n*OWNER*\neval, exec\n\n_You can run *!help <command name>* to show advanced help._`;
    const templateButtons = [
      {
        index: 1,
        urlButton: {
          displayText: "Github",
          url: "https://github.com/JastinXyz/whatsactyl",
        },
      },
      {
        index: 2,
        urlButton: {
          displayText: "Hosting Url",
          url: host,
        },
      },
    ];
    const templateMessage = {
      text: t,
      footer: "© Whatsactyl Bot",
      templateButtons: templateButtons,
    };
    whats.sendMessage(
      from,
      {
        image: {
          url: "https://i.ibb.co/fN6nyDp/pterodactyl-logo.png",
        },
        caption: templateMessage.text,
        footer: templateMessage.footer,
        templateButtons,
      },
      { quoted: msg }
    );
  } else {
    const commandName = args[0];
    let h;
    if (fs.existsSync(`./commands/util/${commandName}.js`)) {
      h = require(`./${commandName}.js`).help;
    } else if (fs.existsSync(`./commands/application/${commandName}.js`)) {
      h = require(`../application/${commandName}.js`).help;
    } else if (fs.existsSync(`./commands/client/${commandName}.js`)) {
      h = require(`../client/${commandName}.js`).help;
    } else if (fs.existsSync(`./commands/owner/${commandName}.js`)) {
      h = require(`../owner/${commandName}.js`).help;
    }

    if (!h) {
      reply(`❌ | Command not found!`);
    } else {
      reply(
        `*${h.name}*\n\nDescription: ${h.description}\nCategory: ${h.category}\nUsage: \`\`\`${h.usage}\`\`\``
      );
    }
  }
};

exports.help = {
  name: "help",
  description: "Show the bot's commands list",
  category: "Utility",
  usage: `${prefix}help`,
};
