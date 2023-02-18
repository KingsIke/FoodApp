import express, { Request, Response, NextFunction } from "express";
import { registerSchema, option, GeneratePassword, GenerateSalt, GenerateOTP, onRequestOTP, emailHtmml, mailSent, GenerateSignature, verifySignature, loginSchema, validatePassword, updateSchema } from "../utils";
import { UserAttribute, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid"
import { fromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";
import SendmailTransport from "nodemailer/lib/sendmail-transport";

/**========================REGISTER USER=========================================== */
export const Register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // return res.status(200).json({
        //     "message": "success",

        // })
        const { email, phone, password, confirm_password } = req.body


        const validateResult = registerSchema.validate(req.body, option)
        // console.log(validateResult)
        if (validateResult.error) {
            // console.log(validateResult.error.details[0])

            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        //GENERATE SALT
        const salt = await GenerateSalt()
        const userPassword = await GeneratePassword(password, salt)
        // console.log(userPassword)

        //GENERATE OTP

        const { otp, expiry } = GenerateOTP();


        //CHECK IF USER EXIST

        const User = await UserInstance.findOne({ where: { email: email } })

        //Create user
        if (!User) {
            await UserInstance.create({
                id: uuidv4(),
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
                role: "user"

            })

            //Send OTP to User

            //await onRequestOTP(otp, phone)

            //Send Email
            const html = emailHtmml(otp)
            await mailSent(fromAdminMail, email, userSubject, html)

            //CHECK IF USER EXIST
            const User = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttribute


            //GENERATE A SIGNATURE FOR THE USER
            let signature = await GenerateSignature({
                id: User.id,
                email: User.email,
                verified: User.verified
            })


            return res.status(201).json({
                msg: "User created successfully check your mail or phone for OTP Verification",
                signature,
                verified: User.verified,
            })
        }
        return res.status(400).json({
            Error: "User already exist"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/signup"
        })
    }

}
/**===================================================== Verify User ===================================== */


export const verifyUser = async (req: Request, res: Response) => {
    try {
        const token = req.params.signature
        const decode = await verifySignature(token);

        //CHECK IF USER EXIST
        const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttribute

        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = await UserInstance.update({
                    verified: true
                }, { where: { email: decode.email } }) as unknown as UserAttribute

                //GENERATE A SIGNATURE
                let signature = await GenerateSignature({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified
                })

                if (updatedUser) {
                    const User = (await UserInstance.findOne({
                        where: { email: decode.email },

                    })) as unknown as UserAttribute
                }

                return res.status(200).json({
                    message: "Your Account is verified successfully",
                    signature,
                    verified: updatedUser.verified
                })
            }
        }
        return res.status(400).json({
            Error: "Invalid credentials or Otp expired"
        })
    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify"
        })
    }


}

/**============LOGIN USER ======================= */


export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const validateResult = loginSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            })
        }

        //CHECK IF USER EXIST
        const User = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttribute



        if (User && User.verified === true) {
            const validation = await validatePassword(password, User.password, User.salt)
            if (validation) {
                //GENERATE A SIGNATURE FOR THE USER
                let signature = await GenerateSignature({
                    id: User.id,
                    email: User.email,
                    verified: User.verified
                });
                return res.status(200).json({
                    message: "YOU have sucessfully loggined In",
                    signature,
                    email: User.email,
                    verified: User.verified
                })
            }
        }
        res.status(400).json({
            Error: "Wrong Username or Password or not verified User"
        })
    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login"
        })
    }
}

/** =================================Resend OTP ====================================== */
export const resendOTP = async (req: Request, res: Response) => {
    try {
        const token = req.params.signature
        const decode = await verifySignature(token);

        //CHECK IF USER EXIST
        const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttribute

        if (User) {
            //GENERATE OTP

            const { otp, expiry } = GenerateOTP();
            const updatedUser = (await UserInstance.update(
                {
                    otp,
                    otp_expiry: expiry
                },
                { where: { email: decode.email } }
            )) as unknown as UserAttribute
            if (updatedUser) {

                const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttribute

                //SEND OTP TO USER
                await onRequestOTP(otp, User.phone);

                //Send mail to User
                const html = emailHtmml(otp);
                await mailSent(fromAdminMail, User.email, userSubject, html)

                return res.status(200).json({
                    message: "OTP resend to registered  number and email",

                })
            }

        }
        return res.status(400).json({
            Error: "Error sending OTP"
        })

    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature"
        })
    }


}

/**================================== PROFILE =============================================== */

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit as number | undefined
        // const users = await UserInstance.findAll({})
        // return res.status(200).json({
        //     message: "You have successfully retrieved all users",
        //     users
        // })
        const users = await UserInstance.findAndCountAll({
            limit: limit
        })
        return res.status(200).json({
            message: "You have successfully retrieved all users",
            Count: users.count,
            User: users.rows

        })
    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/getAllUsers"
        })
    }

}

/**=======================================Single User========================================== */

export const getSingleUser = async (req: JwtPayload, res: Response) => {
    try {
        // const id = req.params.id
        const { id } = req.user
        // console.log(id)
        //find the user by Id
        const User = (await UserInstance.findOne({ where: { id: id }, })) as unknown as UserAttribute;

        if (User) {
            return res.status(200).json({
                message: `${User.email} successful logged in`,
                User
            })
        }
        return res.status(400).json({
            message: `${User} not found`
        })



    } catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/getUser"
        })
    }

}
/**=====================================UPDATE USER PROFILE=========================================== */

export const updateUserProfile = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.user.id
        const { firstName, lastName, address, phone } = req.body;

        //Joi validation
        const validateResult = updateSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            })
        }

        //CHECK IF USER EXIST
        const User = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttribute
        if (!User) {
            return res.status(400).json({
                messsage: "You are not authorised to update your profile"
            })
        }
        // Update
        const updateUser = (await UserInstance.update(
            {
                firstName,
                lastName,
                address,
                phone
            },
            {
                where: { id: id }
            }
        )) as unknown as UserAttribute

        // if updated
        if (updateUser) {
            //CHECK IF USER EXIST
            const User = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttribute
            return res.status(200).json({
                message: "You have successful update your profile",
                User
            })
        }
        return res.status(400).json({
            message: "Error occured"
        })

    } catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/update-profile"
        })
    }
}

//forgot Password