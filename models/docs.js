const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Docs = mongoose.Schema({
    uniqueId: {
      type: String,
      required: true,
      unique:true
    },
    pageType: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    headingIcon: {
      type: String,
    },
    emoji: {
      type: String,
    },
    description: String,
    content: String,
    documentId:{ type: mongoose.Schema.Types.ObjectId, ref: "documents" },
    referenceId: {
      type: String,
    },
    subDomain:{
        type:String,
        required:true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  });
  
  Docs.plugin(mongoosePaginate);
  module.exports.Docs = mongoose.model("docs", Docs);