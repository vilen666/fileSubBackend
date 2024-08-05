let userModel = require("../models/user-model")

let { generateToken } = require("../utils/generateToken")
module.exports.login = async (req, res) => {
    try {
        let { roll, phone } = req.body
        let user = await userModel.findOne({ roll })
        if (user) {
            if (user.phone === phone) {
                let token = generateToken(user)
                // res.cookie("token", token)
                // res.cookie('cookieName', 'cookieValue', { sameSite: 'None', secure: true,httsps });
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure:true,
                    path:"/"
                  });
                res.send({ success: true, data: "You are successfully logged in" })
            }
            else {
                throw new Error("Contact Developer")
            }
        }
        else {
            throw new Error("User not Found!!!")
        }

    } catch (error) {
        res.send({ success: false, data: error.message })
    }
}
module.exports.fetchUser = async (req, res) => {
    try {
        res.send({ success: true, data: req.user })
    } catch (error) {
        res.send({ success: false, data: error.message })
        console.log(error.message)
    }
}

module.exports.upload = async (req, res) => {
    try {
        let userRoll = req.body.userRoll
        let user = await userModel.findOne({ roll: userRoll })
        if (!user) {
            throw new Error("User Not Found")
        }
        else {
            let temp=[]
            let oldFiles = JSON.parse(req.body.oldFiles)
            let newFiles = JSON.parse(req.body.newFiles)
            let files = req.files
            let oldUserPdfs = user.pdfs
            let oldUserPdfsCopy=[...user.pdfs] 
            // console.log(files);
            let decr=0
            oldUserPdfs.forEach((pdf, key) => {
                if (!oldFiles.some(file => file.subcode === pdf.subcode)) {
                    if (newFiles.some(file => file.subcode === pdf.subcode)) {
                        let data = ""
                        for (let i = 0; i < files.length; i++) {
                            if (files[i].originalname.split("-")[1].split(".")[0] === pdf.subcode) {
                                data = files[i].buffer
                                files.splice(i, 1)
                                break
                            }
                        }
                        let flag = 0
                        for (let i = 0; i < newFiles.length; i++) {
                            if (newFiles[i].subcode === pdf.subcode) {
                                flag = i
                                oldUserPdfs[key] = {
                                    subcode: pdf.subcode
                                    , filename: pdf.filename,
                                    contentType: pdf.contentType,
                                    data: data
                                }
                                break
                            }
                        }
                        temp=[...temp,`You updated ${newFiles[flag].filename}` ]
                        newFiles.splice(flag, 1)
                    }
                    else {
                        temp=[...temp,`You deleted ${oldUserPdfsCopy[key-decr].filename}` ]
                        oldUserPdfsCopy.splice(key-decr, 1)
                        decr+=1
                    }
                }
            })
            oldUserPdfs=[...oldUserPdfsCopy]
            newFiles.forEach(pdf => {
                let data = ""
                for (let i = 0; i < files.length; i++) {
                    if (files[i].originalname.split("-")[1].split(".")[0] === pdf.subcode) {
                        data = files[i].buffer
                        files.splice(i, 1)
                        break
                    }
                }
                
                        oldUserPdfs = [...oldUserPdfs,{
                            subcode: pdf.subcode
                            , filename: pdf.filename,
                            contentType: pdf.contentType,
                            data: data
                        }]
                        temp=[...temp,`You added ${pdf.filename}`]
            })
            user.pdfs=[...oldUserPdfs]
            user=await userModel.findByIdAndUpdate({_id:user.id},user)
            console.log(temp)
            res.send({ success: true, data: "Uploaded successfully",list:temp })
        }
    } catch (error) {
        console.log(error.message)
        res.send({ success: false, data: error.message })
    }
}

module.exports.fetchUserPdfs = async (req, res) => {
    try {
        let user = req.user
        user = await userModel.findById({ _id: user._id })
        let pdf = user.pdfs.map((pdf) => {
            return ({ subcode: pdf.subcode, filename: pdf.filename })
        })
        res.send({ success: true, data: pdf })
    } catch (error) {
        console.log(error)
        res.send({ success: false, data: "Error Fetching Pdfs" })
    }
}

module.exports.logout=(req, res) => {
    try{
        res.clearCookie("token")
    res.send({ success: true,data:"You are successfully logged out" })
    }
    catch(err){
        console.log(err);
    }
  }

