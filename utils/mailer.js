// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.WEB_MAIL,         
    pass: process.env.WEB_MAIL_APP_PASSWORD,     
  },
});

module.exports = transporter;
