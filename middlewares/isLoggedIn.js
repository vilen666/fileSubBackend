// const jwt = require("jsonwebtoken");
// const adminModel = require("../models/admin-model");
// const userModel = require("../models/user-model")
// require("dotenv").config();

// module.exports.adminIsLoggedIn = async (req, res, next) => {
//     // Check if the cookies exist and if the token is present
//     if (!req.cookies || !req.cookies.token) {
//         return res.json({ success: false, isLoggedIn:false, data: "You need to login first" });
//     }
//     try {
//         // Verify the token
//         const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
//         // Find the admin user without the password field
//         const admin = await adminModel.findOne({ _id: decoded._id }).select("-password");

//         if (!admin) {
//             return res.json({ success: false,isLoggedIn:false, data: "Invalid token or user not found" });
//         }

//         // Attach the admin user to the request object for further use
//         req.admin = admin;

//         // Call the next middleware or route handler
//         next();
//     } catch (err) {
//         return res.json({ success: false,isLoggedIn:false, data: "There was an error verifying" });
//     }
// };
// module.exports.userIsLoggedIn = async (req, res, next) => {
//     // Check if the cookies exist and if the token is present
//     if (!req.cookies || !req.cookies.token) {
//         return res.json({ success: false, isLoggedIn:false, data: "You need to login first" });
//     }
//     try {
//         // Verify the token
//         const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
//         // Find the admin user without the password field
//         const user = await userModel.findOne({ _id: decoded._id }).select("-pdfs")

//         if (!user) {
//             return res.json({ success: false,isLoggedIn:false, data: "Invalid token or user not found" });
//         }

//         // Attach the admin user to the request object for further use
//         req.user = user;

//         // Call the next middleware or route handler
//         next();
//     } catch (err) {
//         console.log(err.message)
//         return res.json({ success: false,isLoggedIn:false, data: "There was an error verifying" });
//     }
// };

const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin-model");
const userModel = require("../models/user-model");
require("dotenv").config();

module.exports.adminIsLoggedIn = async (req, res, next) => {
    // Check if the Authorization header is present
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, isLoggedIn: false, data: "You need to login first" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Find the admin user without the password field
        const admin = await adminModel.findOne({ _id: decoded._id }).select("-password");

        if (!admin) {
            return res.json({ success: false, isLoggedIn: false, data: "Invalid token or user not found" });
        }

        // Attach the admin user to the request object for further use
        req.admin = admin;

        // Call the next middleware or route handler
        next();
    } catch (err) {
        return res.json({ success: false, isLoggedIn: false, data: "There was an error verifying the token" });
    }
};

module.exports.userIsLoggedIn = async (req, res, next) => {
    // Check if the Authorization header is present
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, isLoggedIn: false, data: "You need to login first" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Find the user without the PDFs field
        const user = await userModel.findOne({ _id: decoded._id }).select("-pdfs");

        if (!user) {
            return res.json({ success: false, isLoggedIn: false, data: "Invalid token or user not found" });
        }

        // Attach the user to the request object for further use
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (err) {
        console.log(err.message);
        return res.json({ success: false, isLoggedIn: false, data: "There was an error verifying the token" });
    }
};
