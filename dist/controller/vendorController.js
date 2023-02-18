"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVendorProfile = exports.deleteFood = exports.vendorProfile = exports.createFood = exports.vendorLogin = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
const vendorModel_1 = require("../model/vendorModel");
const foodModel_1 = require("../model/foodModel");
/**=====================VENDOR LOGIN================= */
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //CHECK IF Vendor EXIST
        const Vendor = (await vendorModel_1.VendorInstance.findOne({ where: { email: email } }));
        if (Vendor) {
            const validation = await (0, utils_1.validatePassword)(password, Vendor.password, Vendor.salt);
            if (validation) {
                //GENERATE A SIGNATURE FOR THE USER
                let signature = await (0, utils_1.GenerateSignature)({
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
                });
            }
        }
        res.status(400).json({
            Error: "Wrong Username or Password or not verified User"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/login",
            king: `${error}`
        });
    }
};
exports.vendorLogin = vendorLogin;
/**================Vendor Add Food ============ */
const createFood = async (req, res) => {
    try {
        const { id } = req.vendor;
        const { name, description, category, foodType, readyTime, price, image } = req.body;
        //  check if he is existing Vendor
        let existingVendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id }
        }));
        if (existingVendor) {
            const createFood = await foodModel_1.FoodInstance.create({
                id: (0, uuid_1.v4)(),
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                rating: 0,
                vendorId: id,
                image: req.file.path
            });
            return res.status(200).json({
                message: "Vendor added successfully",
                createFood,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-food"
        });
    }
};
exports.createFood = createFood;
/**===================================== Get Vendor Profile ======================================= */
const vendorProfile = async (req, res) => {
    try {
        const id = req.vendor.id;
        //check if the vendor exist
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
            attributes: ["id", "email", "name", "restrantName", "address", "phone", "serviceAvaliable", "coverImage"],
            include: [{
                    model: foodModel_1.FoodInstance,
                    as: 'food',
                    attributes: ["id", "name", "description", "category", "foodType", "readyTime", "rating", "vendorId"] //Use to show or hide data from user
                }]
        }));
        return res.status(201).json({
            Vendor
        });
        // if (Vendor) {
        // }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/get-profile",
            king: `${error}`
        });
    }
};
exports.vendorProfile = vendorProfile;
/**====================================== Vendor Delete Food ===================================== */
const deleteFood = async (req, res) => {
    try {
        const id = req.vendor.id;
        const foodid = req.params.foodid;
        // IF VENDOR EXIST 
        const Vendor = (await vendorModel_1.VendorInstance.findOne({ where: { id: id } }));
        if (Vendor) {
            // await FoodInstance.findOne({ where: { id: foodid } }) 
            const deletedFood = await foodModel_1.FoodInstance.destroy({ where: { id: foodid } });
            return res.status(201).json({
                message: "Successfully Deleted Food",
                deletedFood
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/delete-food"
        });
    }
};
exports.deleteFood = deleteFood;
/**===================================UPDATE VENDOR PROFILE ================ */
const updateVendorProfile = async (req, res) => {
    try {
        const id = req.vendor.id;
        const { name, phone, coverImage, address } = req.body;
        // JOI Validation
        const validateResult = utils_1.updateVendorSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        let Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id }
        }));
        if (!Vendor) {
            return res.status(400).json({
                Error: "You are not authorized to Update your profile"
            });
        }
        const updateVendor = (await vendorModel_1.VendorInstance.update({
            name,
            phone,
            address,
            coverImage: req.file.path
        }, {
            where: { id: id }
        }));
        if (updateVendor) {
            const Vendor = (await vendorModel_1.VendorInstance.findOne({
                where: { id: id }
            }));
            return res.status(200).json({
                message: "You have successfully updateed the profile",
                Vendor
            });
        }
        return res.status(400).json({
            message: 'Error occured'
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/update-profile"
        });
    }
};
exports.updateVendorProfile = updateVendorProfile;
