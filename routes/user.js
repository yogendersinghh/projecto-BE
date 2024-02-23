const express = require("express");
const { userInfo,betaMail } = require("../controllers/user");
const router = express.Router()


router.get("/getInfo",userInfo)
router.post("/beta-mail",betaMail)



module.exports = router
