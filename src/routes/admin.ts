import express from "express";
import { AdminRegister, createVendor, SuperAdmin } from "../controller/adminController";

import { auth } from "../middleware/authorization"

const router = express.Router()

router.post('/create-admin', auth, AdminRegister)
router.post('/create-super-admin', SuperAdmin)
router.post('/create-vendor', auth, createVendor)






export default router