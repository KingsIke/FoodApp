"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = exports.SuperAdmin = exports.AdminRegister = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const vendorModel_1 = require("../model/vendorModel");
/**========================REGISTER ADMIN =========================================== */
const AdminRegister = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { email, phone, password, firstName, lastName, address } = req.body;
        //JOI Validation
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //GENERATE SALT
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //GENERATE OTP
        // YOU CAN REMOVE THE OTP STUFF IF U CREATE A DIFFERENT MODEL FOR ADMIN 
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //CHECK IF ADIM EXIST
        const Admin = (await userModel_1.UserInstance.findOne({ where: { id: id } }));
        if (Admin.email === email) {
            return res.status(400).json({
                message: "Email already exist"
            });
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: "phone already exist"
            });
        }
        //Create Admin
        if (Admin.role === "superadmin") {
            await userModel_1.UserInstance.create({
                id: (0, uuid_1.v4)(),
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
            });
            //CHECK IF ADMIN EXIST
            const Admin = await userModel_1.UserInstance.findOne({ where: { id: id } });
            //GENERATE A SIGNATURE FOR THE ADMIN
            let signature = await (0, utils_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified
            });
            return res.status(201).json({
                msg: "Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        // return res.status(400).json({
        //     msg: "Admin already exist"
        // })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admins/create-admin"
        });
    }
};
exports.AdminRegister = AdminRegister;
/**============Super ADMIN ======================= */
const SuperAdmin = async (req, res) => {
    try {
        const { email, phone, password, firstName, lastName, address } = req.body;
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //GENERATE SALT
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //GENERATE OTP
        // YOU CAN REMOVE THE OTP STUFF IF U CREATE A DIFFERENT MODEL FOR ADMIN 
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        //CHECK IF ADIM EXIST
        const Admin = (await userModel_1.UserInstance.findOne({ where: { email: email } }));
        if (!Admin) {
            await userModel_1.UserInstance.create({
                id: (0, uuid_1.v4)(),
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
            });
            //check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate signature for user
            let signature = await (0, utils_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified
            });
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified
            });
        }
        return res.status(400).json({
            message: "Admin already exist",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admins/create-super-admin"
        });
    }
};
exports.SuperAdmin = SuperAdmin;
/**===============================CREATE VENDOR ========================================== */
const createVendor = async (req, res) => {
    try {
        const id = req.user.id;
        const { name, restrantName, pincode, phone, address, email, password } = req.body;
        const validateResult = utils_1.vendorSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        //GENERATE SALT
        const salt = await (0, utils_1.GenerateSalt)();
        const vendorPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // Check if vendor exist
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        // check if admin or superadmin
        const Admin = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.role === "admin" || Admin.role === "superadmin") {
            if (!Vendor) {
                const createVendor = await vendorModel_1.VendorInstance.create({
                    id: (0, uuid_1.v4)(),
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
                });
                return res.status(201).json({
                    message: "Vendor created Successfully",
                    createVendor
                });
            }
            return res.status(400).json({
                message: "Vendor already Exist"
            });
        }
        return res.status(400).json({
            message: "Unauthorize to create Vendor"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/admins/create-vendors"
        });
    }
};
exports.createVendor = createVendor;
