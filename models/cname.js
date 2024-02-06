const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cname = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    cnameTarget:String,
    subDomain:{
        type:String,
        required:true,
        unique:true
    },
    documentId:String
});

cname.plugin(mongoosePaginate);
module.exports.CNAME = mongoose.model("cname", cname);
