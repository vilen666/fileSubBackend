const express=require('express')
const router = express.Router()

const { login, fetchUser,upload, fetchUserPdfs,logout } = require('../controllers/userAuthController')
const { userIsLoggedIn } = require('../middlewares/isLoggedIn')
const uploadMulter = require('../config/multerConfig')
const multerHandler = require('../middlewares/multerHandler')
router.post("/",login)

router.get("/fetchUser",userIsLoggedIn,fetchUser)

router.post("/upload",userIsLoggedIn, uploadMulter.array('pdfs', 10),multerHandler,upload)

router.get("/fetchUserPdfs",userIsLoggedIn,fetchUserPdfs)

router.get("/logout", logout)
module.exports=router