const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const blogUrl = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    subDomain:{
        type:String,
        required:true,
        unique:true
    }
});

blogUrl.plugin(mongoosePaginate);
module.exports = mongoose.model("blogUrl", blogUrl);
