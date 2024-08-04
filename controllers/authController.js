let bcrypt = require("bcrypt")
let adminModel = require("../models/admin-model")
let userModel = require("../models/user-model")
const archiver = require('archiver');
require("dotenv").config()

module.exports.register = async (req, res) => {
    if (process.env.NODE_ENV === "development") {
        let admin = await adminModel.find();
        let { username, password } = req.body
        try {

            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    res.send({ success: false, data: `Contact Developer` })
                }
                else {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err) {
                            return res.send({ success: false, data: `Contact Developer` })
                        }
                        let admin = await adminModel.findOne({ username })
                        if (admin) {
                            admin = await adminModel.findByIdAndUpdate({ _id: admin.id }, { password: hash })
                            return res.json({ success: true, data: `Password updated` })
                        }
                        admin = await adminModel.create({
                            username,
                            password: hash,
                        })
                        return res.json({ success: true, data: `Admin registered` })
                    })
                }
            })
        }
        catch (err) {
            return res.json({ success: false, data: `Contact Developer` })
        }
    }
    else {
        res.json({ success: false, data: `Contact Developer` })
    }
}

let { generateToken } = require("../utils/generateToken")
const { response } = require("express")
module.exports.login = async (req, res) => {
    let { username, password } = req.body
    let admin = await adminModel.findOne({ username });
    if (!admin) {
        return res.send({ success: false, data: "username not found" })
    }
    else {
        bcrypt.compare(password, admin.password, (err, result) => {
            if (!result) {
                return res.json({ success: false, data: "Password Incorrect" })
            }
            else {
                let token = generateToken(admin)
                res.cookie("token", token,{
                    httpOnly:true,
                    secure:true,
                    sameSite:"None",
                    path:"/"
                });
                return res.send({ success: true, data: "You are Successfully logged in" })
            }
        })
    }
}

module.exports.checkLogin = (req, res) => {
    if (req.admin) {
        res.send({ success: true, data: "You are logged in" })
    }
}

module.exports.logout = (req, res) => {
    try {
        res.clearCookie("token")
        res.send({ success: true, data: "You are successfully logged out" })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.fetchSubs = async (req, res) => {
    let admin = await adminModel.find()
    admin = admin[0]
    if(admin){
    res.send({ success: true, data: admin.subcodes})
    }
    else{
        res.send({success:false,data:[]})
    }
}

module.exports.subUpdate = async (req, res) => {
    try {
        let admin = req.admin
        admin = await adminModel.findByIdAndUpdate({ _id: admin._id }, { subcodes: req.body.subcodes })
        res.send({ success: true, data: "SuccessFully Updated Subjects" })
    } catch (error) {
        res.send({ success: false, data: "Contact Developer" })
    }
}

module.exports.addUser = async (req, res) => {
    try {
        let user = await userModel.findOne({ name: req.body.name })
        if (user) {
            user = await userModel.findByIdAndUpdate({ _id: user._id }, req.body)
        }
        else {
            user = await userModel.create(req.body)
        }
        res.send({ success: true, data: "SuccessFully added user" })
    } catch (error) {
        console.log(error)
        res.send({ success: false, data: "Contact Developer" })
    }
}

module.exports.fetchUsers = async (req, res) => {
    try {
        let users = await userModel.find().select("-pdfs")
        res.send({ success: true, data: users })
    } catch (error) {
        res.send({ success: false, data: "Contact Developer" })

    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        let user = await userModel.findByIdAndDelete({ _id: req.body._id })
        res.send({ success: true, data: "SuccessFully deleted user" })
    } catch (error) {
        res.send({ success: false, data: "Contact Developer" })
    }
}

module.exports.fetchFiles = async (req, res) => {
    try {
        let users = await userModel.find()
        let data = users.map(user => {
            let temp = user.pdfs.map(pdf => ({ roll: user.roll, subcode: pdf.subcode, filename: pdf.filename }))
            return (
                temp
            )
        })
        data = data.flat()
        res.send({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.send({ success: false, data: error.message })
    }
}

module.exports.deleteFile = async (req, res) => {
    try {
        let user = await userModel.findOne({ roll: req.body.roll })
        let pdfs = user.pdfs
        pdfs = pdfs.filter(pdf => (pdf.subcode !== req.body.subcode))
        user.pdfs = [...pdfs]
        user = await userModel.findByIdAndUpdate({ _id: user._id }, user)
        res.send({ success: true, data: `Successfully deleted ${req.body.roll}-${req.body.subcode}.pdf` })
    }
    catch (error) {
        res.send({ success: false, data: error.message })
    }
}

module.exports.downloadZip = async (req, res) => {
    try {
        let subcode = req.params.subcode
        console.log(subcode)
        let pdfs = await userModel.find().select("pdfs")
        pdfs = pdfs.map(pdf => (pdf.pdfs))
        pdfs = [...pdfs.flat()]
        pdfs = pdfs.filter(pdf => (pdf.subcode === subcode)).map(pdf => ({filename:pdf.filename,data:pdf.data}))
        console.log(pdfs.length);
        if (pdfs.length) {
            // Set response headers for ZIP download
            // res.setHeader('Content-Disposition', `attachment; filename="${subcode}.zip"`);
            // res.setHeader('Content-Type', 'application/zip');
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${subcode}.zip"`,
                'Content-Type': 'application/zip'
            });
            // Create a zip stream
            const archive = archiver('zip', { zlib: { level: 9 } });

            // Pipe the zip stream to the response
            archive.pipe(res);

            // Append each PDF to the zip
            pdfs.forEach((pdf) => {
                archive.append(pdf.data, { name: pdf.filename });
            });

            // Finalize the zip file (end the stream)
            await archive.finalize();
        }
        else {
            throw new Error("no Files Found")
        }
    } catch (error) {
        console.log(error.message);
        res.status(201).json({ message:error.message });
    }
}