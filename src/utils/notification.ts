import { accountSid, authToken, fromAdminPhone, GMAIL_PASS, GMAIL_USER, fromAdminMail, userSubject } from "../config"
import nodemailer from "nodemailer"
import { string } from "joi"

export const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    // console.log(otp)
    const expiry = new Date()
    // console.log(Date.now())
    // console.log(expiry)
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    console.log(
        // expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    )
    return { otp, expiry }
}

// GenerateOTP()

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages
        .create({
            body: `Your OTP IS ${otp}`,
            to: toPhoneNumber,
            from: fromAdminPhone
        })
    return response
}

export const transport = nodemailer.createTransport({
    service: "gmail", //service is same as Host
    auth: {
        user: GMAIL_USER, // generated ethereal user
        pass: GMAIL_PASS, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }

})

// send mail with defined transport object
// let info = await transporter.sendMail({
//     from,
//     to: "bar@example.com, baz@e, // list of receivers
//     subject, // Subject line
//     text,  // plain text body
//     html, // html body
// });


export const mailSent = async (
    from: string,
    to: string,
    subject: string, // Subject line
    html: string,
) => {
    try {
        const response = await transport.sendMail({
            from: fromAdminMail, to, subject: userSubject, html
        },)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const emailHtmml = (otp: number): string => {
    let response = `<div style="max-width:700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%">
    <h2 style="text-align:center; text-transform:uppercase; color:gold;">Welcome to KingsIke Store  </h2>
    <p> Hi Dear, your otp is ${otp}</p>
    </div>`
    return response
}