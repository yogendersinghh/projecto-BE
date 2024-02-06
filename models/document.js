const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const document = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    subDomain:{
        type:String,
        required:true
    }
});

document.plugin(mongoosePaginate);
module.exports = mongoose.model("document", document);
