"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtmml = exports.mailSent = exports.transport = exports.onRequestOTP = exports.GenerateOTP = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    // console.log(otp)
    const expiry = new Date();
    // console.log(Date.now())
    // console.log(expiry)
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    console.log(
    // expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    );
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
// GenerateOTP()
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require('twilio')(config_1.accountSid, config_1.authToken);
    const response = await client.messages
        .create({
        body: `Your OTP IS ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
exports.transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});
// send mail with defined transport object
// let info = await transporter.sendMail({
//     from,
//     to: "bar@example.com, baz@e, // list of receivers
//     subject, // Subject line
//     text,  // plain text body
//     html, // html body
// });
const mailSent = async (from, to, subject, // Subject line
html) => {
    try {
        const response = await exports.transport.sendMail({
            from: config_1.fromAdminMail, to, subject: config_1.userSubject, html
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
};
exports.mailSent = mailSent;
const emailHtmml = (otp) => {
    let response = `<div style="max-width:700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%">
    <h2 style="text-align:center; text-transform:uppercase; color:gold;">Welcome to KingsIke Store  </h2>
    <p> Hi Dear, your otp is ${otp}</p>
    </div>`;
    return response;
};
exports.emailHtmml = emailHtmml;
