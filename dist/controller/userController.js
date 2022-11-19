"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
/**========================REGISTER USER=========================================== */
const Register = async (req, res, next) => {
    try {
        // return res.status(200).json({
        //     "message": "success",
        // })
        const { email, phone, password, confirm_password } = req.body;
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        // console.log(validateResult)
        if (validateResult.error) {
            // console.log(validateResult.error.details[0])
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //GENERATE SALT
        const salt = await (0, utils_1.GenerateSalt)();
        const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // console.log(userPassword)
        //GENERATE OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //CHECK IF USER EXIST
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        //Create user
        if (!User) {
            let user = await userModel_1.UserInstance.create({
                id: (0, uuid_1.v4)(),
                email,
                password: userPassword,
                firstName: '',
                lastName: '',
                salt,
                address: '',
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
            });
            //Send OTP to User
            await (0, utils_1.onRequestOTP)(otp, phone);
            //Send Email
            const html = (0, utils_1.emailHtmml)(otp);
            await (0, utils_1.mailSent)(config_1.fromAdminMail, email, config_1.userSubject, html);
            //CHECK IF USER EXIST
            const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
            //GENERATE A SIGNATURE FOR THE USER
            let signature = await (0, utils_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified
            });
            return res.status(201).json({
                msg: "User created successfully check your mail or phone for OTP Verification",
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            msg: "User already exist"
        });
    }
    catch (error) {
        // console.log(error)
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/signup"
        });
    }
};
exports.Register = Register;
/**===================================================== Verify User ===================================== */
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        //CHECK IF USER EXIST
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = await userModel_1.UserInstance.update({
                    verified: true
                }, { where: { email: decode.email } });
                //GENERATE A SIGNATURE
                let signature = await (0, utils_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified
                });
                if (updatedUser) {
                    const User = (await userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                }
                return res.status(200).json({
                    message: "Your Account is verified successfully",
                    signature,
                    verified: updatedUser.verified
                });
            }
        }
        return res.status(400).json({
            Error: "Invalid credentials or Otp expired"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify"
        });
    }
};
exports.verifyUser = verifyUser;
/**============LOGIN USER ======================= */
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //CHECK IF USER EXIST
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (User) {
            const validation = await (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //GENERATE A SIGNATURE FOR THE USER
                let signature = await (0, utils_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified
                });
                return res.status(200).json({
                    message: "YOU have sucessfully loggined In",
                    signature,
                    email: User.email,
                    verified: User.verified
                });
            }
        }
        res.status(400).json({
            Error: "Wrong Username or Password"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login"
        });
    }
};
exports.Login = Login;
/** =================================Resend OTP ====================================== */
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        //CHECK IF USER EXIST
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            //GENERATE OTP
            const { otp, expiry } = (0, utils_1.GenerateOTP)();
            const updatedUser = (await userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry
            }, { where: { email: decode.email } }));
            if (updatedUser) {
                const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
                //SEND OTP TO USER
                await (0, utils_1.onRequestOTP)(otp, User.phone);
                //Send mail to User
                const html = (0, utils_1.emailHtmml)(otp);
                await (0, utils_1.mailSent)(config_1.fromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resend to registered  number and email",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature"
        });
    }
};
exports.resendOTP = resendOTP;
