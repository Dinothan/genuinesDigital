const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({});

module.exports = mongoose.model("Sessions", sessionSchema);
