const mongoose = require("mongoose");
const schema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("beta-mail", schema);
