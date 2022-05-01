const P = require("pino");
const {
  default: makeWASocket,
  DisconnectReason,
  AnyMessageContent,
  delay,
  proto,
  jidDecode,
  useSingleFileAuthState,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  generateMessageID,
  makeInMemoryStore,
} = require("@adiwajshing/baileys");
const baileys = require("@adiwajshing/baileys");
const axios = require("axios");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const conf = require("./config.json")
const { state, loadState, saveState } = useSingleFileAuthState("./state.json");
const availableCommands = new Set();

/*const pteroApi = require('@linux123123/jspteroapi');
const _app = new pteroApi.Application(conf.host, conf.api_key); // for application API
const _client = new pteroApi.Client(conf.host, api_key); // for Client API*/

const getVersionWaweb = () => {
  let version;
  try {
    let { data } = axios.get(
      "https://web.whatsapp.com/check-update?version=1&platform=web"
    );
    version = [data.currentVersion.replace(/[.]/g, ", ")];
  } catch {
    version = [2, 2204, 13];
  }
  return version;
};

const startSock = () => {
  const whats = makeWASocket({
    logger: P({ level: "fatal" }),
    printQRInTerminal: true,
    auth: state,
    browser: ["Whatsactyl Bot", "Safari", "1.0.0"],
    version: getVersionWaweb() || [2, 2204, 13],
  });

  let args;
  let command;

  fs.readdir("./commands/util", (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
      availableCommands.add(commandFile.replace(".js", ""));
    });
  });
    
  fs.readdir("./commands/client", (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
      availableCommands.add(commandFile.replace(".js", ""));
    });
  });

  fs.readdir("./commands/application", (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
      availableCommands.add(commandFile.replace(".js", ""));
    });
  });
    
  whats.ev.on("messages.upsert", async (m) => {
    var msg = m.messages[0];
    if (!m || !msg.message) return;
    if (msg.key && msg.key.remoteJid === "status@broadcast") return;
    const from = msg.key.remoteJid;
    const content = JSON.stringify(msg.message);
    const type = Object.keys(msg.message)[0];
    const text =
      type === "conversation" && msg.message.conversation
        ? msg.message.conversation
        : type == "imageMessage" && msg.message.imageMessage.caption
        ? msg.message.imageMessage.caption || ""
        : type == "videoMessage" && msg.message.videoMessage.caption
        ? msg.message.videoMessage.caption
        : type == "extendedTextMessage" && msg.message.extendedTextMessage.text
        ? msg.message.extendedTextMessage.text
        : "";

    try {
      if (text.startsWith(conf.prefix)) {
        args = text.slice(conf.prefix.length).trim().split(/ +/g);
        command = args.shift().toLowerCase();
        sender = msg.pushName;
      } else {
        return;
      }
    } catch {}
    if (availableCommands.has(command)) {
      require(`./commands/util/${command}` || `./commands/client/${command}` || `./commands/application/${command}`).run(whats, msg, args);
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
    console.log("[WA SYSTEM] Connection Sucsess!");
  });

  whats.ev.on("creds.update", saveState);
};

startSock();
