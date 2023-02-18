import express, { Request, Response, NextFunction } from "express";
import { UserAttribute, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid"
import jwt, { JwtPayload } from "jsonwebtoken";
// import { adminSchema, GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, option, validatePassword } from "../utils";
import { fromAdminMail, userSubject } from "../config";
import { GenerateSignature, loginSchema, option, updateSchema, updateVendorSchema, validatePassword } from "../utils";
import { VendorAttribute, VendorInstance } from "../model/vendorModel";
import { FoodAttribute, FoodInstance } from "../model/foodModel";

/**=====================VENDOR LOGIN================= */
export const vendorLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const validateResult = loginSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            })
        }

        //CHECK IF Vendor EXIST
        const Vendor = (await VendorInstance.findOne({ where: { email: email } })) as unknown as VendorAttribute



        if (Vendor) {
            const validation = await validatePassword(password, Vendor.password, Vendor.salt)
            if (validation) {
                //GENERATE A SIGNATURE FOR THE USER
                let signature = await GenerateSignature({
                    id: Vendor.id,
                    email: Vendor.email,
                    serviceAvaliable: Vendor.serviceAvaliable

                });
                return res.status(200).json({
                    message: "Vendor have sucessfully loggined In",
                    signature,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvaliable,
                    role: Vendor.role
                })
            }
        }
        res.status(400).json({
            Error: "Wrong Username or Password or not verified User"
        })
    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/login",
            king: `${error}`
        })
    }
}

/**================Vendor Add Food ============ */

export const createFood = async (req: JwtPayload, res: Response) => {
    try {
        const { id } = req.vendor
        const { name, description, category, foodType, readyTime, price, image } = req.body;

        //  check if he is existing Vendor

        let existingVendor = (await VendorInstance.findOne({
            where: { id: id }
        })) as unknown as VendorAttribute

        if (existingVendor) {
            const createFood = await FoodInstance.create({
                id: uuidv4(),
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                rating: 0,
                vendorId: id,
                image: req.file.path
            })
            return res.status(200).json({
                message: "Vendor added successfully",
                createFood,
            })
        }

    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-food"
        })
    }
}

/**===================================== Get Vendor Profile ======================================= */

export const vendorProfile = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.vendor.id
        //check if the vendor exist
        const Vendor = (await VendorInstance.findOne({
            where: { id: id },
            attributes: ["id", "email", "name", "restrantName", "address", "phone", "serviceAvaliable", "coverImage"],
            include: [{
                model: FoodInstance,
                as: 'food',
                attributes: ["id", "name", "description", "category", "foodType", "readyTime", "rating", "vendorId"] //Use to show or hide data from user
            }]
        })) as unknown as VendorAttribute;
        return res.status(201).json({
            Vendor
        })

        // if (Vendor) {

        // }
    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/get-profile",
            king: `${error}`
        })
    }
}

/**====================================== Vendor Delete Food ===================================== */

export const deleteFood = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.vendor.id;
        const foodid = req.params.foodid
        // IF VENDOR EXIST 
        const Vendor = (await VendorInstance.findOne({ where: { id: id } })) as unknown as VendorAttribute;

        if (Vendor) {
            // await FoodInstance.findOne({ where: { id: foodid } }) 
            const deletedFood = await FoodInstance.destroy({ where: { id: foodid } })

            return res.status(201).json({
                message: "Successfully Deleted Food",
                deletedFood
            })
        }


    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/delete-food"
        })
    }
}

/**===================================UPDATE VENDOR PROFILE ================ */
export const updateVendorProfile = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.vendor.id;
        const { name, phone, coverImage, address } = req.body;

        // JOI Validation
        const validateResult = updateVendorSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        let Vendor = (await VendorInstance.findOne({
            where: { id: id }
        })) as unknown as VendorAttribute

        if (!Vendor) {
            return res.status(400).json({
                Error: "You are not authorized to Update your profile"
            })
        }

        const updateVendor = (await VendorInstance.update({
            name,
            phone,
            address,
            coverImage: req.file.path
        }, {
            where: { id: id }
        }
        )) as unknown as VendorAttribute;

        if (updateVendor) {
            const Vendor = (await VendorInstance.findOne({
                where: { id: id }
            })) as unknown as VendorAttribute
            return res.status(200).json({
                message: "You have successfully updateed the profile",
                Vendor
            })
        }
        return res.status(400).json({
            message: 'Error occured'
        })

    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/update-profile"
        })
    }
}