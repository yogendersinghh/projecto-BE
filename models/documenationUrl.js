const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const documentUrl = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    subDomain:{
        type:String,
        required:true,
    },
    title:{
        type:String,
    }
});

documentUrl.plugin(mongoosePaginate);
module.exports.DocumentUrl = mongoose.model("documentationUrl", documentUrl);
