const mongoose = require("mongoose");
const { mongodb } = require("../config.json");

const a = mongoose.connect(mongodb, { autoIndex: true });

a.then(() => {
  console.log("[mongodb] Connected to mongo server.");
}).catch((e) => {
  console.log("[mongodb] Failed to connect to server.");
});

var User = mongoose.model(
  "User",
  new mongoose.Schema({
    pushname: {
      type: String,
      require: true,
    },
    no: {
      type: String,
      required: true,
    },
    api_key: {
      type: String,
      required: true,
    },
  })
);

exports.User = User;
