const express=require('express')
const router = express.Router()

router.get("/",(req,res)=>{
    res.send("hello from projects backend!")
})

const {register,login, fetchSubs, subUpdate, addUser, fetchUsers, deleteUser, logout, checkLogin, fetchFiles, deleteFile, downloadZip}=require("../controllers/authController")
let {adminIsLoggedIn}=require("../middlewares/isLoggedIn")

router.post("/register",register)
router.post("/login",login)
router.get("/checkLogin",adminIsLoggedIn,checkLogin)
router.get("/logout",logout)

router.get("/fetchSubs",fetchSubs)
router.post("/subUpdate",adminIsLoggedIn,subUpdate)

router.post("/addUser",adminIsLoggedIn,addUser)
router.get("/fetchUsers",adminIsLoggedIn,fetchUsers)
router.post("/deleteUser",adminIsLoggedIn,deleteUser)

router.get("/fetchFiles",adminIsLoggedIn,fetchFiles)
router.post("/deleteFile",adminIsLoggedIn,deleteFile)
router.get("/downloadZip/:subcode",adminIsLoggedIn,downloadZip)
module.exports=router;