"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVendor = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userModel_1 = require("../model/userModel");
const vendorModel_1 = require("../model/vendorModel");
const auth = async (req, res, next) => {
    try {
        const authorizatiion = req.headers.authorization; //req.cookies.jwt can also be use
        if (!authorizatiion) {
            return res.status(401).json({
                Error: "Unauthorized, Kindly sign In"
            });
        }
        //Bearer Token
        const token = authorizatiion.slice(7, authorizatiion.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRECT);
        if (!verified) {
            return res.status(401).json({
                Error: "User not verified"
            });
        }
        const { id } = verified;
        //find the user by Id
        const user = (await userModel_1.UserInstance.findOne({ where: { id: id }, }));
        if (!user) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({
            Error: "Unauthorized"
        });
    }
};
exports.auth = auth;
const authVendor = async (req, res, next) => {
    try {
        const authorizatiion = req.headers.authorization; //req.cookies.jwt can also be use
        if (!authorizatiion) {
            return res.status(401).json({
                Error: "Unauthorized, Kindly sign In"
            });
        }
        //Bearer Token
        const token = authorizatiion.slice(7, authorizatiion.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRECT);
        if (!verified) {
            return res.status(401).json({
                Error: "User not verified"
            });
        }
        const { id } = verified;
        //find the vendor by Id
        const vendor = (await vendorModel_1.VendorInstance.findOne({ where: { id: id }, }));
        if (!vendor) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            });
        }
        req.vendor = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({
            Error: "Unauthorized"
        });
    }
};
exports.authVendor = authVendor;
