"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary = require('cloudinary').v2;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "FOOD",
            allowed_formats: ['jpg', 'png'],
            unique_filename: true,
        };
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
