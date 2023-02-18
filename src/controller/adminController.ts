import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { adminSchema, GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, option, vendorSchema } from "../utils";
import { UserAttribute, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid"
import { VendorAttribute, VendorInstance } from "../model/vendorModel";
import { exist } from "joi";


/**========================REGISTER ADMIN =========================================== */
export const AdminRegister = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.user.id
        const { email, phone, password, firstName, lastName, address } = req.body;

        //JOI Validation
        const validateResult = adminSchema.validate(req.body, option)
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        //GENERATE SALT
        const salt = await GenerateSalt()
        const adminPassword = await GeneratePassword(password, salt)

        //GENERATE OTP
        // YOU CAN REMOVE THE OTP STUFF IF U CREATE A DIFFERENT MODEL FOR ADMIN 

        const { otp, expiry } = GenerateOTP();

        //CHECK IF ADIM EXIST

        const Admin = (await UserInstance.findOne({ where: { id: id } })) as unknown as UserAttribute

        if (Admin.email === email) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: "phone already exist"
            })
        }

        //Create Admin
        if (Admin.role === "superadmin") {
            await UserInstance.create({
                id: uuidv4(),
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin"


            })



            //CHECK IF ADMIN EXIST
            const Admin = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttribute



            //GENERATE A SIGNATURE FOR THE ADMIN
            let signature = await GenerateSignature({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified
            })


            return res.status(201).json({
                msg: "Admin created successfully",
                signature,
                verified: Admin.verified,
            })
        }
        // return res.status(400).json({
        //     msg: "Admin already exist"
        // })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admins/create-admin"
        })
    }

};

/**============Super ADMIN ======================= */


export const SuperAdmin = async (req: Request, res: Response) => {
    try {
        const { email, phone, password, firstName, lastName, address } = req.body;
        const validateResult = adminSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        //GENERATE SALT
        const salt = await GenerateSalt()
        const adminPassword = await GeneratePassword(password, salt)

        //GENERATE OTP
        // YOU CAN REMOVE THE OTP STUFF IF U CREATE A DIFFERENT MODEL FOR ADMIN 

        const { otp, expiry } = GenerateOTP();

        //CHECK IF ADIM EXIST

        const Admin = (await UserInstance.findOne({ where: { email: email } })) as unknown as UserAttribute
        if (!Admin) {
            await UserInstance.create({
                id: uuidv4(),
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "superadmin"
            })
            //check if the admin exist
            const Admin = (await UserInstance.findOne({
                where: { email: email },
            })) as unknown as UserAttribute;

            //Generate signature for user
            let signature = await GenerateSignature({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified
            })
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });

    } catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admins/create-super-admin"
        })
    }
}
/**===============================CREATE VENDOR ========================================== */

export const createVendor = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.user.id
        const { name, restrantName, pincode, phone, address, email, password } = req.body;



        const validateResult = vendorSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        //GENERATE SALT
        const salt = await GenerateSalt();
        const vendorPassword = await GeneratePassword(password, salt);

        // Check if vendor exist
        const Vendor = (await VendorInstance.findOne({
            where: { email: email },
        })) as unknown as VendorAttribute;
        // check if admin or superadmin
        const Admin = (await UserInstance.findOne({
            where: { id: id },
        })) as unknown as UserAttribute;

        if (Admin.role === "admin" || Admin.role === "superadmin") {



            if (!Vendor) {
                const createVendor = await VendorInstance.create({
                    id: uuidv4(),
                    name,
                    restrantName,
                    email,
                    address,
                    pincode,
                    phone,
                    password: vendorPassword,
                    salt,
                    role: "vendor",
                    serviceAvaliable: false,
                    rating: 0,
                    coverImage: ''
                })

                return res.status(201).json({
                    message: "Vendor created Successfully",
                    createVendor
                })
            }

            return res.status(400).json({
                message: "Vendor already Exist"
            })
        }
        return res.status(400).json({
            message: "Unauthorize to create Vendor"
        })



    } catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admins/create-vendors"
        })
    }
}