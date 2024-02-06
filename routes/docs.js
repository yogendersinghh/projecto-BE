const express = require("express");
const { create,read,editPage,removePage,searchTitle, saveCname, mainDocument, docList, deleteDoc } = require("../controllers/docs");
const router = express.Router()


router.post("/create",create)
router.post("/read",read)
router.post("/removePage",removePage)
router.post("/editPage",editPage)
router.post("/search",searchTitle)
router.post("/save-cname",saveCname)
router.post("/create-doc",mainDocument)
router.post("/read-doc",docList)
router.delete("/delete-doc",deleteDoc)

module.exports = router
