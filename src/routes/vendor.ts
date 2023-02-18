import express from "express";
import { getAllUsers, getSingleUser, Login, Register, resendOTP, updateUserProfile, verifyUser } from "../controller/userController"
import { createFood, deleteFood, updateVendorProfile, vendorLogin, vendorProfile } from "../controller/vendorController";
import { auth, authVendor } from "../middleware/authorization"
import { upload } from "../utils/multer";

const router = express.Router()

router.post('/login', vendorLogin)
router.post('/create-food', upload.single("image"), authVendor, createFood)
router.get('/get-profile', authVendor, vendorProfile)
router.patch('/update-profile', authVendor, upload.single("coverImage"), updateVendorProfile)

router.delete('/delete-food/:foodid', authVendor, deleteFood)





export default router