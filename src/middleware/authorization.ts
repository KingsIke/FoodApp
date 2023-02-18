import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { APP_SECRECT } from "../config";
import { UserAttribute, UserInstance } from "../model/userModel";
import { VendorAttribute, VendorInstance } from "../model/vendorModel";


export const auth = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const authorizatiion = req.headers.authorization //req.cookies.jwt can also be use
        if (!authorizatiion) {
            return res.status(401).json({
                Error: "Unauthorized, Kindly sign In"
            })
        }
        //Bearer Token
        const token = authorizatiion.slice(7, authorizatiion.length)
        let verified = jwt.verify(token, APP_SECRECT)

        if (!verified) {
            return res.status(401).json({
                Error: "User not verified"
            })
        }
        const { id } = verified as { [key: string]: string }


        //find the user by Id
        const user = (await UserInstance.findOne({ where: { id: id }, })) as unknown as UserAttribute;
        if (!user) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            })
        }

        req.user = verified
        next()



    } catch (error) {
        return res.status(401).json({
            Error: "Unauthorized"
        })
    }
}

export const authVendor = async (req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const authorizatiion = req.headers.authorization //req.cookies.jwt can also be use
        if (!authorizatiion) {
            return res.status(401).json({
                Error: "Unauthorized, Kindly sign In"
            })
        }
        //Bearer Token
        const token = authorizatiion.slice(7, authorizatiion.length)
        let verified = jwt.verify(token, APP_SECRECT)

        if (!verified) {
            return res.status(401).json({
                Error: "User not verified"
            })
        }
        const { id } = verified as { [key: string]: string }


        //find the vendor by Id
        const vendor = (await VendorInstance.findOne({ where: { id: id }, })) as unknown as VendorAttribute;
        if (!vendor) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            })
        }

        req.vendor = verified
        next()



    } catch (error) {
        return res.status(401).json({
            Error: "Unauthorized"
        })
    }
}