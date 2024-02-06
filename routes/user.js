const express = require("express");
const { userInfo } = require("../controllers/user");
const router = express.Router()


router.get("/getInfo",userInfo)


module.exports = router
