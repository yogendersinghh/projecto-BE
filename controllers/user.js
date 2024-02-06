const BlogUrl = require("../models/blogUrl");
const WorkFlowUrl = require("../models/workFlowUrl");
const DocumenationUrl = require("../models/documenationUrl");
const User = require("../models/user");
const { sendResponse } = require("../utils/response");

module.exports.userInfo = async (req, res) => {
  const userdata = req.user;
  try {
    const user = await User.findById(userdata.id);
    if (!user) {
      return sendResponse(400, { message: "user doesn't exist" }, res);
    }
    const [documentationURls,blogUrls,workFlowUrls] = await Promise.all([
        DocumenationUrl.find({user:user._id}),
        BlogUrl.find({user:user._id}),
        WorkFlowUrl.find({user:user._id})

    ])
    return sendResponse(200, { message: {documentationURls,blogUrls,workFlowUrls,user} }, res);
  } catch (err) {
    console.log("🚀 ~ module.exports.userInfo= ~ err:", err)
    return sendResponse(500, { message: err }, res);
  }
};
