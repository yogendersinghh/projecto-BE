const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Users = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

Users.plugin(mongoosePaginate);
module.exports = mongoose.model("users", Users);
