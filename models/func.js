const conf = require("../config.json");
const { User } = require("./db.js");
const { msg } = require("../index.js");

module.exports = {
  isAdmin: async function isAdmin(key) {
    const a = await module.exports.client.userAccount(key);
    if (a.success == false) {
      return false;
    }

    return a.attributes.admin;
  },
  getUserApiKey: async function getUserApiKey(id) {
    const a = await User.findOne({ no: id }, "-_id -_v");
    if (a == null) {
      return undefined;
    } else {
      return a.api_key;
    }
  },
  getNo: function getNo(msgy) {
    return msgy.key.fromMe
      ? whats.user.id
      : msgy.key.participant
      ? msgy.key.participant
      : msgy.key.participant
      ? msgy.key.participant
      : msgy.key.remoteJid;
  },
  // OUTATED...
  client: {
    serverDetails: async function serverDetails(serverid, keyid) {
      const y = await axios({
        url: `${conf.host}/api/client/servers/${serverid}/resources`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
      });
      return y.data;
    },
    userAccount: async function userAccount(keyid) {
      try {
        const y = await axios({
          url: `${conf.host}/api/client/account`,
          method: "GET",
          followRedirect: true,
          maxRedirects: 5,
          headers: {
            Authorization: "Bearer " + keyid,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
          },
        });
        return y.data;
      } catch (e) {
        return { success: false };
      }
    },
    userPermissions: async function userPermissions(keyid) {
      const y = await axios({
        url: `${conf.host}/api/client/permissions`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
      });
      return y.data;
    },
    serverStop: async function serverStop(serverid, keyid) {
      const y = await axios({
        url: `${conf.host}/api/servers/${serverid}/power`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: { signal: "stop" },
      });
      return y.data;
    },
    serverStart: async function serverStart(serverid, keyid) {
      const y = await axios({
        url: `${conf.host}/api/servers/${serverid}/power`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: { signal: "start" },
      });
      return {};
    },
    serverKill: async function serverKill(serverid, keyid) {
      const y = await axios({
        url: `${conf.host}/api/servers/${serverid}/power`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: { signal: "kill" },
      });
      return {};
    },
    serverRestart: async function serverRestart(serverid, keyid) {
      axios({
        url: `${conf.host}/api/servers/${serverid}/power`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: { signal: "kill" },
      });
      setTimeout(() => {
        axios({
          url: `${conf.host}/api/servers/${serverid}/power`,
          method: "GET",
          followRedirect: true,
          maxRedirects: 5,
          headers: {
            Authorization: "Bearer " + keyid,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
          },
          data: { signal: "start" },
        });
      }, 500);
      return {};
    },
    serverSendCommand: async function serverSendCommand(
      serverid,
      keyid,
      message
    ) {
      const y = await axios({
        url: `${conf.host}/api/client/servers/${serverid}/command`,
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + keyid,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
        data: { command: message },
      });
      return {};
    },
  },
};
