const { sendResponse } = require("../utils/response");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const expiresIn = process.env.EXPIRES_IN;

module.exports.login = async (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendResponse(400, {
      message: "Please provide the email and password",
    },res);
  }
  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return sendResponse(400, {
        message: `User with email ${email} does not exist`,
      },res);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(400, {
        message: "Invalid credentials",
      },res);
    }
    const { id, firstName, lastName } = user;
    const payload = {
      user: {
        id,
      },
    };

    console.log("expiresIn",expiresIn)

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
    return sendResponse(200, {
      data: {
        id,
        firstName,
        lastName,
        email,
        token,
      },
    },res);
  } catch (e) {
    console.error(e);
    return sendResponse(500, {
      status: false,
      message: "Server Error",
    },res);
  }
};

module.exports.signup = async (req,res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return sendResponse(400, { message: "Please provide all information" },res);
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return sendResponse(400, {
          message: `User with email ${email} already exists`,
        },res);
      }
      await User.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      });
      return sendResponse(200, {
        data: {
          firstName,
          lastName,
          email,
          password: encryptedPassword,
        },
      },res);
    } catch (error) {
      console.log(error);
      return sendResponse(500, {
        data: error,
      },res);
    }
  } catch (err) {
    console.log(err);
    return sendResponse(500, {
      message: "something went wrong",
    },res);
  }
};
