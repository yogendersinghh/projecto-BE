const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const workFlowUrl = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    subDomain:{
        type:String,
        required:true,
        unique:true
    }
});

workFlowUrl.plugin(mongoosePaginate);
module.exports = mongoose.model("workFlowUrl", workFlowUrl);
