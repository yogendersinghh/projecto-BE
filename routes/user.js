const express = require("express");
const { userInfo,betaMail } = require("../controllers/user");
const router = express.Router()


router.get("/getInfo",userInfo)
router.get("/beta-mail",betaMail)



module.exports = router
