const BlogUrl = require("../models/blogUrl");
const WorkFlowUrl = require("../models/workFlowUrl");
const {DocumentUrl} = require("../models/documenationUrl");
const User = require("../models/user");
const { sendResponse } = require("../utils/response");
const MAIL = require("../models/mail")

module.exports.userInfo = async (req, res) => {
  const userdata = req.user;
  try {
    const user = await User.findById(userdata.id);
    if (!user) {
      return sendResponse(400, { message: "user doesn't exist" }, res);
    }
    const [documentationURls,blogUrls,workFlowUrls] = await Promise.all([
        DocumentUrl.find({user:user._id}),
        BlogUrl.find({user:user._id}),
        WorkFlowUrl.find({user:user._id})

    ])
    return sendResponse(200, { message: {documentationURls,blogUrls,workFlowUrls,user} }, res);
  } catch (err) {
    console.log("🚀 ~ module.exports.userInfo= ~ err:", err)
    return sendResponse(500, { message: err }, res);
  }
};

module.exports.betaMail = async (req, res) => {
  const { userMail } = req.body
  try {
    const docs = await MAIL.find({ email: userMail });
    if (docs.length) {
      return sendResponse(400, {
        message: "Mail is already registered for beta access",
      },res);
    }
    const newEmail = await MAIL({
      email: userMail,
    });
    await newEmail.save();
    return sendResponse(200, {
      message: "You are successfully registered for the beta access.",
    },res);
  } catch (error) {
    console.error("Error sending email:", error);
    return sendResponse(500, { message: error.message },res);
  }
};

