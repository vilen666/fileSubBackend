const nodemailer = require('nodemailer');
require("dotenv").config()
// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any other email service you prefer
  auth: {
    user: process.env.MAIL_USER, // your email
    pass:  process.env.MAIL_PASS // your email password or app-specific password
  }
});

// Function to send email
const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: {
        name:"Supra",
        address:process.env.MAIL_USER
    }, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
