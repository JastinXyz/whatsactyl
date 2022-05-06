const P = require("pino");
const {
  default: makeWASocket,
  DisconnectReason,
  AnyMessageContent,
  delay,
  proto,
  jidDecode,
  useSingleFileAuthState,
  getContentType,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  generateMessageID,
  makeInMemoryStore,
} = require("@adiwajshing/baileys");
const baileys = require("@adiwajshing/baileys");
global.axios = require("axios");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const conf = require("./config.json");
const { User } = require("./models/db.js");
const { getNo } = require("./models/func.js");
const { state, loadState, saveState } = useSingleFileAuthState("./state.json");
const availableCommands = new Set();

const getVersionWaweb = () => {
  let version;
  try {
    let { data } = axios.get(
      "https://web.whatsapp.com/check-update?version=1&platform=web"
    );
    version = [data.currentVersion.replace(/[.]/g, ", ")];
  } catch {
    version = [2, 2214, 12];
  }
  return version;
};

const startSock = () => {
  var whats = makeWASocket({
    logger: P({ level: "fatal" }),
    printQRInTerminal: true,
    auth: state,
    browser: ["Whatsactyl Bot", "Safari", "1.0.0"],
    version: getVersionWaweb() || [2, 2214, 12],
  });

  let args;
  let command;

  // command handler
  const commandFolders = fs.readdirSync("./commands");

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    fs.readdir(`./commands/${folder}`, (e, files) => {
      if (e) return console.error(e);
      files.forEach((commandFile) => {
        availableCommands.add(commandFile.replace(".js", ""));
        console.log(`Loaded - ${commandFile}`);
      });
    });
  }

  whats.ev.on("messages.upsert", async (m) => {
    try {
      var msg = m.messages[0];
      exports.msg = msg;
      if (!m || !msg.message) return;
      if (msg.key && msg.key.remoteJid === "status@broadcast") return;
      global.from = msg.key.remoteJid;
      const content = JSON.stringify(msg.message);
      const type = getContentType(msg.message);
      const prefix = conf.prefix;
      const ownerNumber = conf.ownerNumber;
      const text =
        type === "conversation" && msg.message.conversation
          ? msg.message.conversation
          : type == "imageMessage" && msg.message.imageMessage.caption
          ? msg.message.imageMessage.caption || ""
          : type == "videoMessage" && msg.message.videoMessage.caption
          ? msg.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            msg.message.extendedTextMessage.text
          ? msg.message.extendedTextMessage.text
          : "";
      const isGroup = from.endsWith("@g.us");
      const senderp = isGroup ? msg.key.participant : msg.key.remoteJid;
      var dy =
        type === "conversation" && msg.message.conversation
          ? msg.message.conversation
          : type == "imageMessage" && msg.message.imageMessage.caption
          ? msg.message.imageMessage.caption
          : type == "documentMessage" && msg.message.documentMessage.caption
          ? msg.message.documentMessage.caption
          : type == "videoMessage" && msg.message.videoMessage.caption
          ? msg.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            msg.message.extendedTextMessage.text
          ? msg.message.extendedTextMessage.text
          : type == "buttonsResponseMessage" &&
            msg.message.buttonsResponseMessage.selectedButtonId
          ? msg.message.buttonsResponseMessage.selectedButtonId
          : type == "templateButtonReplyMessage" &&
            msg.message.templateButtonReplyMessage.selectedId
          ? msg.message.templateButtonReplyMessage.selectedId
          : "";
      const argsp = text.trim().split(/ +/g).slice(1);
      const q = argsp.join(" ");
      global.isOwner = [whats.user.id, ...ownerNumber]
        .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
        .includes(senderp.replace(":14", ""));

      //Auto Read
      if (conf.autoread) {
        whats.sendReadReceipt(from, msg.key.participant, [msg.key.id]);
      }

      //Function
      global.reply = async (iy) => {
        whats.sendMessage(msg.key.remoteJid, { text: iy }, { quoted: msg });
      };

      global.replyWithImgAndCap = async (link, cap) => {
        whats.sendMessage(
          msg.key.remoteJid,
          { image: { url: link }, caption: cap },
          { quoted: msg }
        );
      };

      global.error = async (info) => {
        whats.sendMessage(
          msg.key.remoteJid,
          { text: "❌ | Something error here, " + info },
          { quoted: msg }
        );
      };

      try {
        if (dy.startsWith(conf.prefix)) {
          args = dy.slice(conf.prefix.length).trim().split(/ +/g);
          command = args.shift().toLowerCase();
          sender = msg.pushName;
        } else {
          return;
        }
      } catch {}

      var afterArgs = args.slice(1).join(" ");
      if (availableCommands.has(command)) {
        if (fs.existsSync(`${__dirname}/commands/util/${command}.js`)) {
          require(`${__dirname}/commands/util/${command}.js`).run(
            whats,
            msg,
            args,
            q,
            text,
            afterArgs
          );
        } else if (
          fs.existsSync(`${__dirname}/commands/application/${command}.js`)
        ) {
          require(`${__dirname}/commands/application/${command}.js`).run(
            whats,
            msg,
            args,
            q,
            text,
            afterArgs
          );
        } else if (
          fs.existsSync(`${__dirname}/commands/client/${command}.js`)
        ) {
          require(`${__dirname}/commands/client/${command}.js`).run(
            whats,
            msg,
            args,
            q,
            text,
            afterArgs
          );
        } else if (fs.existsSync(`${__dirname}/commands/owner/${command}.js`)) {
          require(`${__dirname}/commands/owner/${command}.js`).run(
            whats,
            msg,
            args,
            q,
            text,
            afterArgs
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  whats.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = lastDisconnect.error
        ? new Boom(lastDisconnect)?.output.statusCode
        : 0;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        startSock();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("[WA SYSTEM] Connection closed, reconnecting....");
        startSock();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("[WA SYSTEM] Connection Lost from Server, reconnecting...");
        startSock();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "[WA SYSTEM] Connection Replaced, Another New Session Opened, Please Close Current Session First"
        );
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          `[WA SYSTEM] Device Logged Out, Please Delete Session and Scan Again.`
        );
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("[WA SYSTEM] Restart Required, Restarting...");
        startSock();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("[WA SYSTEM] Connection TimedOut, Reconnecting...");
        startSock();
      } else {
        console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
    }
    console.log("Connected!", update);
  });

  whats.ev.on("creds.update", saveState);
};

startSock();
